import WebSocket from "ws";
import Board from "../../domains/Board";
import { ModelsWorkingCommands, ModelsCommandsForHost, IServerMessage, ServerMessageTypes, IActionConfig, ServerInfoMessageTexts, WEB_CLIENT_PORT, WORK_INTERVAL_VALUE, STATISTIC_INTERVAL_VALUE } from "../../utils/constants";
import { Client } from "../../domains/Client";
import { randomUUID } from "crypto";

let clientsList: Client[] = [];

const board = new Board();

const MODEL_WORKING_COMMANDS = Object.values(ModelsWorkingCommands);
const MODELS_COMMANDS_FOR_HOST = Object.values(ModelsCommandsForHost);

export const createModelsByHostCommand = (board: Board): void => {
    board.createModels();
}

export const startModels = (board: Board): void => {
    board.startModels()
}

 export const stopModels = (board: Board): void => {
    board.stopModels();
 }

export const sendMessageCurrentClient = (messageType: string, message: any, webSocketClient: WebSocket): void => {
    const serverMessage: IServerMessage = {
        messageType: messageType,
        message: message,
    }

    webSocketClient.send(JSON.stringify(serverMessage));
}

export const sendMessageAllClients = (messageType: string, message: any) => {
    const serverMessage: IServerMessage = {
        messageType: messageType,
        message: message,
    }

    clientsList.forEach((client) => {
        const clientSocket = client.getSocket();

        if (!clientSocket) {
            throw new Error("Cannot send clear charts message, someone client is undefined");
        }

        clientSocket.send(JSON.stringify(serverMessage));
    });
}

export const sendModelsActionsStates = (webSocketClient: WebSocket): void => {
    const isModelsStart = board.getIsModelStart();
    const isModelsStop = board.getIsModelStop();

    const modelsActionsStatesMessage: IServerMessage = {
        messageType: ServerMessageTypes.MODELS_ACTIONS_STATES,
        message: [isModelsStart, isModelsStop],
    }

    webSocketClient.send(JSON.stringify(modelsActionsStatesMessage));
}

const ActionsConfigsList: Record<ModelsWorkingCommands, IActionConfig> = {
    [ModelsWorkingCommands.CREATE]: {
        modelActionFunction: () => {createModelsByHostCommand(board)},
        clientSendActionFunctions: [],
        allClientsSendActionFunctions: [],
        infoMessage: ServerInfoMessageTexts.CREATE_MODELS,
    },
    [ModelsWorkingCommands.START]: {
        modelActionFunction: () => {startModels(board)},
        clientSendActionFunctions: [sendModelsActionsStates],
        allClientsSendActionFunctions: [() => {sendMessageAllClients(ServerMessageTypes.CLEAR_CHARTS, "")}
        ],
        infoMessage: ServerInfoMessageTexts.START_MODELS,
    },
    [ModelsWorkingCommands.STOP]: {
        modelActionFunction: () => {stopModels(board)},
        clientSendActionFunctions: [sendModelsActionsStates],
        allClientsSendActionFunctions: [],
        infoMessage: ServerInfoMessageTexts.STOP_MODELS,
    },
}

export const modelAction = (modelActionFunction: () => void, clientSendActionFunctions: any[], allClientsSendActionFunctions: any[], webSocketClient: WebSocket, infoMessage: string): void => {
    modelActionFunction();

    clientSendActionFunctions.forEach((clientSendActionFunction) => {
        clientSendActionFunction(webSocketClient);
    });

    allClientsSendActionFunctions.forEach((allClientsSendActionFunction) => allClientsSendActionFunction());

    sendMessageAllClients(ServerMessageTypes.MESSAGE, infoMessage);
}

export const webSocketClientSetup = (webSocketClient: WebSocket, client: Client): void => {
    sendMessageCurrentClient(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.CONNECT_MESSAGE, webSocketClient);

    if (clientsList.length) {
        clientsList.push(client);

        console.log("Another client connected to the server");
        return;
    }

    client.setIsHost(true);

    clientsList.push(client);

    modelAction(() => {createModelsByHostCommand(board)}, [], [], webSocketClient, ServerInfoMessageTexts.CREATE_MODELS);

    sendMessageCurrentClient(ServerMessageTypes.MODELS_WORKING_COMMANDS, MODELS_COMMANDS_FOR_HOST, webSocketClient);

    console.log("First client connected to server and get all commands!");
}

const handleClientCommand = (webSocketClient: WebSocket, commandID: string) => {
    if (!MODEL_WORKING_COMMANDS.includes(commandID as ModelsWorkingCommands)) {
        console.log("Unexpected command from client!");
        return;
    };

    const actionConfigure: IActionConfig = ActionsConfigsList[commandID as ModelsWorkingCommands];

    const modelActionFunction = actionConfigure.modelActionFunction;
    const clientSendActionFunction = actionConfigure.clientSendActionFunctions;
    const allClientsSendActionFunctions = actionConfigure.allClientsSendActionFunctions;
    const actionInfoMessage = actionConfigure.infoMessage;

    modelAction(modelActionFunction, clientSendActionFunction, allClientsSendActionFunctions, webSocketClient, actionInfoMessage);
}

export const hanldeClientLeave = (leavedClientID: string) => {
    if (clientsList[0].getID() === leavedClientID) {
        board.stopModels();

        sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.STOP_MODELS);
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

            handleClientCommand(webSocketClient, parsedString);
        });
        webSocketClient.on('close', () => { hanldeClientLeave(clientID) });
        webSocketClient.on("error", getWebSocketErrorStatus);
    });
}