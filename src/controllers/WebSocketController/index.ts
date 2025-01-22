import WebSocket from "ws";
import { createModel, startModel, stopModel } from "../ModelController";
import { WEB_CLIENT_PORT, ModelWorkingCommands, IServerMessage, ServerMessageTypes, ServerMessageTexts, IModelCurrentState, ModelWorkingCommandsIDList } from "./meta";
import { Client } from "../../domains/Client";
import { randomUUID } from "crypto";

let clientsList: Client[] = [];

const MODEL_WORKING_COMMANDS = Object.values(ModelWorkingCommands);

const ActionsInfoList: Record<ModelWorkingCommands, () => void> = {
    [ModelWorkingCommands.START]: startModel,
    [ModelWorkingCommands.STOP]: stopModel,
}

export const sendStartMessage = (webSocketClient: WebSocket): void => {
    const startMessage: IServerMessage = {
        messageType: ServerMessageTypes.MESSAGE,
        message: ServerMessageTexts.CONNECTMESSAGE,
    }
    webSocketClient.send(JSON.stringify(startMessage));
}

export const sendModalCommandsMessage = (webSocketClient: WebSocket): void => {
    const modelWorkingCommands: string[] = MODEL_WORKING_COMMANDS;
    const modelWorkingCommandsMessage: IServerMessage = {
        messageType: ServerMessageTypes.MODELWORKINGCOMMANDS,
        message: modelWorkingCommands,
    }

    webSocketClient.send(JSON.stringify(modelWorkingCommandsMessage));
}

export const sendModelCurrentState = (modelCurrentState: IModelCurrentState): void => {
    clientsList.forEach((client) => {
        const modelCurrentStateMessage: IServerMessage = {
            messageType: ServerMessageTypes.MODELCURRENTSTATE,
            message: modelCurrentState,
        }

        const clientSocket = client.getSocket();

        if (!clientSocket) {
            console.log("Error client create");
            return;
        }

        clientSocket.send(JSON.stringify(modelCurrentStateMessage));
    })
}

export const webSocketClientSetup = (webSocketClient: WebSocket, client: Client): void => {
    sendStartMessage(webSocketClient);

    if (clientsList.length) {
        clientsList.push(client);

        console.log("Another client connected to the server");
        return;
    }

    client.setIsMain(true);

    clientsList.push(client);

    sendModalCommandsMessage(webSocketClient);

    console.log("First client connected to server and get all commands!");
}

const handleClientCommand = (commandID: string) => {
    if (!MODEL_WORKING_COMMANDS.includes(commandID as ModelWorkingCommands)) {
        console.log("Unexpected command from client!");
        return;
    };

    ActionsInfoList[commandID as ModelWorkingCommands]();
}

export const hanldeClientLeave = (leavedClientID: string) => {
    if (clientsList[0].getID() === leavedClientID) {
        stopModel();
    }
    
    clientsList = clientsList.filter((client) =>
        client.getID() !== leavedClientID
    );

    console.log(`Another client closed connection!`);
}

export const getWebSocketErrorStatus = (event: any): void => {
    console.log("WebSocket error!", event.data);
}

export const webSocketCreateConnection = (): void => {
    const webSocketServer = new WebSocket.Server({ port: WEB_CLIENT_PORT });

    webSocketServer.on("connection", (webSocketClient) => {
        const newClient = new Client();
        const clientID: string = randomUUID();

        newClient.setID(clientID);
        newClient.setSocket(webSocketClient);

        webSocketClientSetup(webSocketClient, newClient);

        webSocketClient.on('message', (event) => {
            const parsedString = event.toString("utf-8");

            handleClientCommand(parsedString);
        });
        webSocketClient.on('close', (event) => { hanldeClientLeave(clientID) });
        webSocketClient.on("error", getWebSocketErrorStatus);
    });
}