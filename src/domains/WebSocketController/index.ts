import WebSocket from "ws";
import { ModelsWorkingCommands, ModelsCommandsForHost, IServerMessage, ServerMessageTypes, IActionConfig, ServerInfoMessageTexts, WEB_CLIENT_PORT } from "../../utils/constants";
import { Client } from "../../domains/Client";
import { randomUUID } from "crypto";
import Board from "../Board";
import { TActionsConfigsList, TServicedBoard } from "./meta";

let clientsList: Client[] = [];

const MODEL_WORKING_COMMANDS = Object.values(ModelsWorkingCommands);
const MODELS_COMMANDS_FOR_HOST = Object.values(ModelsCommandsForHost);

export class WebSocketController {
    private servicedBoard: TServicedBoard | null;
    private actionsConfigsList: TActionsConfigsList | null;

    constructor() {
        this.servicedBoard = null;
        this.actionsConfigsList = null;
    }

    public getServicedBoard(): TServicedBoard | null {
        return this.servicedBoard;
    } 

    public getActionsConfigsList(): TActionsConfigsList | null {
        return this.actionsConfigsList;
    } 

    public setServicedBoard(servicedBoard: Board): void {
        this.servicedBoard = servicedBoard;
    }

    public createModelsInBoard(): void {
        if (!this.servicedBoard) {
            throw new Error("Cannot create models in board, serviced board is undefined");
        }

        this.servicedBoard.createModels();
    }

    public startBoard(): void {
        if (!this.servicedBoard) {
            throw new Error("Cannot start board, serviced board is undefined");
        }

        // this.servicedBoard.startModels();
    }

    public stopBoard(): void {
        if (!this.servicedBoard) {
            throw new Error("Cannot stop board, serviced board is undefined");
        }

        this.servicedBoard.stopModels();
    }

    public initActionsConfigsList(): void {
        if (!this.servicedBoard) {
            throw new Error("Cannot init actions configs list, serviced board is undefined");
        }

        this.actionsConfigsList = {
            [ModelsWorkingCommands.CREATE]: {
                modelActionFunction: this.createModelsInBoard,
                clientSendActionFunctions: [],
                allClientsSendActionFunctions: [],
                infoMessage: ServerInfoMessageTexts.CREATE_MODELS,
            },
            [ModelsWorkingCommands.START]: {
                modelActionFunction: this.startBoard,
                clientSendActionFunctions: [this.sendModelsActionsStates],
                allClientsSendActionFunctions: [() => {this.sendMessageAllClients(ServerMessageTypes.CLEAR_CHARTS, "")}
                ],
                infoMessage: ServerInfoMessageTexts.START_MODELS,
            },
            [ModelsWorkingCommands.STOP]: {
                modelActionFunction: this.stopBoard,
                clientSendActionFunctions: [this.sendModelsActionsStates],
                allClientsSendActionFunctions: [],
                infoMessage: ServerInfoMessageTexts.STOP_MODELS,
            },
        };
    }

    public sendMessageCurrentClient = (messageType: string, message: any, webSocketClient: WebSocket): void => {
        const serverMessage: IServerMessage = {
            messageType: messageType,
            message: message,
        }
    
        webSocketClient.send(JSON.stringify(serverMessage));
    }
    
    public sendMessageAllClients = (messageType: string, message: any) => {
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
    
    public sendModelsActionsStates = (webSocketClient: WebSocket): void => {
        if (!this.servicedBoard) {
            throw new Error("Cannot send models action states, serviced board is undefined");
        }

        const isModelsStart = this.servicedBoard.getIsModelStart();
        const isModelsStop = this.servicedBoard.getIsModelStop();
    
        const modelsActionsStatesMessage: IServerMessage = {
            messageType: ServerMessageTypes.MODELS_ACTIONS_STATES,
            message: [isModelsStart, isModelsStop],
        }
    
        webSocketClient.send(JSON.stringify(modelsActionsStatesMessage));
    }
    
    public modelAction = (modelActionFunction: () => void, clientSendActionFunctions: any[], allClientsSendActionFunctions: any[], webSocketClient: WebSocket, infoMessage: string): void => {
        modelActionFunction();
    
        clientSendActionFunctions.forEach((clientSendActionFunction) => {
            clientSendActionFunction(webSocketClient);
        });
    
        allClientsSendActionFunctions.forEach((allClientsSendActionFunction) => allClientsSendActionFunction());
    
        this.sendMessageAllClients(ServerMessageTypes.MESSAGE, infoMessage);
    }
    
    public webSocketClientSetup = (webSocketClient: WebSocket, client: Client): void => {
        this.sendMessageCurrentClient(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.CONNECT_MESSAGE, webSocketClient);
    
        if (clientsList.length) {
            clientsList.push(client);
    
            console.log("Another client connected to the server");
            return;
        }
    
        client.setIsHost(true);
    
        clientsList.push(client);
    
        this.sendMessageCurrentClient(ServerMessageTypes.MODELS_WORKING_COMMANDS, MODELS_COMMANDS_FOR_HOST, webSocketClient);
    
        console.log("First client connected to server and get all commands!");
    }
    
    public handleClientCommand = (webSocketClient: WebSocket, commandID: string) => {
        if (!MODEL_WORKING_COMMANDS.includes(commandID as ModelsWorkingCommands)) {
            console.log("Unexpected command from client!");
            return;
        };

        if (!this.actionsConfigsList) {
            throw new Error("Cannot handle client command, actions configs list is undefined");
        }
    
        const actionConfigure: IActionConfig = this.actionsConfigsList[commandID as ModelsWorkingCommands];
    
        const modelActionFunction = actionConfigure.modelActionFunction;
        const clientSendActionFunction = actionConfigure.clientSendActionFunctions;
        const allClientsSendActionFunctions = actionConfigure.allClientsSendActionFunctions;
        const actionInfoMessage = actionConfigure.infoMessage;
    
        this.modelAction(modelActionFunction, clientSendActionFunction, allClientsSendActionFunctions, webSocketClient, actionInfoMessage);
    }
    
    public hanldeClientLeave = (leavedClientID: string) => {
        if (clientsList[0].getID() === leavedClientID) {
            if (!this.servicedBoard) {
                throw new Error("Cannot handle host client leave, serviced board is undefined");
            }

            this.servicedBoard.stopModels();
    
            this.sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.STOP_MODELS);
        }
    
        clientsList = clientsList.filter((client) =>
            client.getID() !== leavedClientID
        );
    
        console.log(`Another client closed connection!`);
    }
    
    public getWebSocketErrorStatus = (event: any): void => {
        console.log("WebSocket error!", event.data);
    }
    
    public webSocketCreateConnection = (): void => {
        const webSocketServer = new WebSocket.Server({ port: WEB_CLIENT_PORT });
    
        webSocketServer.on("connection", (webSocketClient) => {
            const newClient = new Client();
            const clientID: string = randomUUID();
    
            newClient.setID(clientID);
            newClient.setSocket(webSocketClient);
    
            this.webSocketClientSetup(webSocketClient, newClient);
    
            webSocketClient.on('message', (event) => {
                const parsedString = event.toString("utf-8");
    
                this.handleClientCommand(webSocketClient, parsedString);
            });
            webSocketClient.on('close', () => { this.hanldeClientLeave(clientID) });
            webSocketClient.on("error", this.getWebSocketErrorStatus);
        });
    }
}

