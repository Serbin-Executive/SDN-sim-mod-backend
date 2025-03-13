import WebSocket from "ws";
import Board from "../../domains/Board";
import { Client } from "../../domains/Client";
import { randomUUID } from "crypto";
import { boardWorkCommandsConfig, ClientCommandsTypes, COMMAND_INFO_WITHOUS_SETTINGS_CONFIG, IActionConfig, IClientMessage, IServerMessage, ServerInfoMessageTexts, ServerMessageTypes } from "./meta";
import { DEFAULT_DELAY_VALUE, DEFAULT_IS_PARTIAL_INITIAL_BOOT, DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE, DEFAULT_JITTER_DANGER_VALUE, DEFAULT_LOAD_FACTOR_DANGER_VALUE, DEFAULT_MAX_DELAY_CAPACITY, DEFAULT_MAX_QUEUE_CAPACITY, DEFAULT_MAX_SPAWN_AGENTS_VALUE, DEFAULT_MIN_DELAY_CAPACITY, DEFAULT_MIN_QUEUE_CAPACITY, DEFAULT_MIN_SPAWN_AGENTS_VALUE, DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE, DEFAULT_MODELS_COUNT_VALUE, DEFAULT_PACKET_LOST_DANGER_VALUE, DEFAULT_PING_DANGER_VALUE, DEFAULT_STATISTIC_INTERVAL_VALUE, DEFAULT_WORK_INTERVAL_VALUE, WEB_CLIENT_PORT } from "../../utils/constants";
import { ISettingsConfig } from "../../domains/Board/meta";

let loadedBoardSettingsConfig: ISettingsConfig = {
    modelsCountValue: DEFAULT_MODELS_COUNT_VALUE,
    minSpawnAgentsValue: DEFAULT_MIN_SPAWN_AGENTS_VALUE,
    maxSpawnAgentsValue: DEFAULT_MAX_SPAWN_AGENTS_VALUE,
    workIntervalValue: DEFAULT_WORK_INTERVAL_VALUE,
    statisticIntervalValue: DEFAULT_STATISTIC_INTERVAL_VALUE,
    modelSourceElementsCountValue: DEFAULT_MODEL_SOURCE_ELEMENTS_COUNT_VALUE,
    minQueueCapacity: DEFAULT_MIN_QUEUE_CAPACITY,
    maxQueueCapacity: DEFAULT_MAX_QUEUE_CAPACITY,
    minDelayCapacity: DEFAULT_MIN_DELAY_CAPACITY,
    maxDelayCapacity: DEFAULT_MAX_DELAY_CAPACITY,
    delayValue: DEFAULT_DELAY_VALUE,
    loadFactorDangerValue: DEFAULT_LOAD_FACTOR_DANGER_VALUE,
    packetLostDangerValue: DEFAULT_PACKET_LOST_DANGER_VALUE,
    pingDangerValue: DEFAULT_PING_DANGER_VALUE,
    jitterDangerValue: DEFAULT_JITTER_DANGER_VALUE,
    isPartialInitialBoot: DEFAULT_IS_PARTIAL_INITIAL_BOOT,
    isQualityOfServiceActive: DEFAULT_IS_QUALITY_OF_SERVICE_ACTIVE,
};

export const WebSocketController = (board: Board, startDate: Date) => {
    let clientsList: Client[] = [];

    const MODEL_WORKING_COMMANDS = Object.values(ClientCommandsTypes);

    const sendMessageHostClient = (messageType: string, message: any): void => {
        const hostSocket = clientsList[0].getSocket();

        if (!hostSocket) {
            throw new Error("Cannot send message for host, host is undefined");
        }

        const serverMessage: IServerMessage = {
            messageType: messageType,
            message: message,
        }

        hostSocket.send(JSON.stringify(serverMessage));
    }

    const sendMessageCurrentClient = (messageType: string, message: any, webSocketClient: WebSocket): void => {
        const serverMessage: IServerMessage = {
            messageType: messageType,
            message: message,
        }

        webSocketClient.send(JSON.stringify(serverMessage));
    }

    const sendMessageAllClients = (messageType: string, message: any) => {
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

    const sendModelsActionsStates = (webSocketClient: WebSocket): void => {
        const isModelsCreate = board.getisModelsCreate();
        const isModelsStart = board.getIsModelStart();
        const isModelsStop = board.getIsModelStop();

        const modelsActionsStatesMessage: IServerMessage = {
            messageType: ServerMessageTypes.MODELS_ACTIONS_STATES,
            message: [isModelsCreate, isModelsStart, isModelsStop],
        }

        webSocketClient.send(JSON.stringify(modelsActionsStatesMessage));
    }

    const ActionsConfigsList: Record<ClientCommandsTypes, IActionConfig> = {
        [ClientCommandsTypes.CREATE]: {
            updateBoardFunction: () => { board.updateSettingsConfig(loadedBoardSettingsConfig) },
            boardActionFunction: () => { board.create() },
            clientSendActionFunctions: [],
            allClientsSendActionFunctions: [() => { sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.CREATE_MODELS) }],
        },
        [ClientCommandsTypes.START]: {
            updateBoardFunction: null,
            boardActionFunction: () => {
                board.start();
                startDate = new Date();
            },
            clientSendActionFunctions: [sendModelsActionsStates],
            allClientsSendActionFunctions: [() => { sendMessageAllClients(ServerMessageTypes.CLEAR_CHARTS, "") },
            () => { sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.START_MODELS) }
            ],
        },
        [ClientCommandsTypes.STOP]: {
            updateBoardFunction: null,
            boardActionFunction: () => { board.stop() },
            clientSendActionFunctions: [sendModelsActionsStates],
            allClientsSendActionFunctions: [() => { sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.STOP_MODELS) }],
        },
    }

    const boardAction = (updateBoardFunction: any, boardActionFunction: () => void, clientSendActionFunctions: any[], allClientsSendActionFunctions: any[], webSocketClient: WebSocket): void => {
        if (updateBoardFunction) {
            updateBoardFunction();
        }
        boardActionFunction();

        clientSendActionFunctions.forEach((clientSendActionFunction) => {
            clientSendActionFunction(webSocketClient);
        });

        allClientsSendActionFunctions.forEach((allClientsSendActionFunction) => allClientsSendActionFunction());
    }

    const webSocketClientSetup = (webSocketClient: WebSocket, client: Client): void => {
        sendMessageCurrentClient(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.CONNECT_MESSAGE, webSocketClient);

        if (clientsList.length) {
            clientsList.push(client);

            console.log("Another client connected to the server");
            return;
        }

        client.setIsHost(true);

        clientsList.push(client);

        sendMessageCurrentClient(ServerMessageTypes.MODELS_WORKING_COMMANDS, boardWorkCommandsConfig, webSocketClient);

        console.log("First client connected to server and get all commands!");
    }

    const handleClientCommand = (webSocketClient: WebSocket, message: IClientMessage) => {
        if (!MODEL_WORKING_COMMANDS.includes(message.commandID as ClientCommandsTypes)) {
            console.log("Unexpected command from client!");
            return;
        };

        if (message.commandInfo !== COMMAND_INFO_WITHOUS_SETTINGS_CONFIG) {
            loadedBoardSettingsConfig = message.commandInfo;
        }

        const actionConfigure: IActionConfig = ActionsConfigsList[message.commandID as ClientCommandsTypes];

        const updateBoardFunction = actionConfigure.updateBoardFunction;
        const boardActionFunction = actionConfigure.boardActionFunction;
        const clientSendActionFunction = actionConfigure.clientSendActionFunctions;
        const allClientsSendActionFunctions = actionConfigure.allClientsSendActionFunctions;

        boardAction(updateBoardFunction, boardActionFunction, clientSendActionFunction, allClientsSendActionFunctions, webSocketClient);
    }

    const hanldeClientLeave = (leavedClientID: string) => {
        if (clientsList[0].getID() === leavedClientID) {
            board.stop();

            sendMessageAllClients(ServerMessageTypes.MESSAGE, ServerInfoMessageTexts.STOP_MODELS);
        }

        clientsList = clientsList.filter((client) =>
            client.getID() !== leavedClientID
        );

        console.log(`Another client closed connection!`);
    }

    const getWebSocketErrorStatus = (event: any): void => {
        console.log("WebSocket error!", event.data);
    }

    const webSocketCreateConnection = (): void => {
        const webSocketServer = new WebSocket.Server({ port: WEB_CLIENT_PORT });

        webSocketServer.on("connection", (webSocketClient) => {
            const newClient = new Client();
            const clientID: string = randomUUID();

            newClient.setID(clientID);
            newClient.setSocket(webSocketClient);

            webSocketClientSetup(webSocketClient, newClient);

            webSocketClient.on('message', (event) => {
                const parsedMessage: IClientMessage = JSON.parse(event.toString("utf-8"));

                handleClientCommand(webSocketClient, parsedMessage);
            });
            webSocketClient.on('close', () => { hanldeClientLeave(clientID) });
            webSocketClient.on("error", getWebSocketErrorStatus);
        });
    }

    return {
        webSocketCreateConnection,
        sendMessageAllClients,
    }
}