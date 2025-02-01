import Agent from "../../domains/Agent";
import DelayElement from "../../domains/DelayElement";
import NetworkElement from "../../domains/NetworkElement";
import QueueElement from "../../domains/QueueElement";
import SinkElement from "../../domains/SinkElement";
import SourceElement from "../../domains/SourceElement";
import Model from "../../domains/Model";
// import Board from "../../domains/Board";
import { sendMessageAllClients } from "../WebSocketController";
import { MODELS_COUNT_VALUE, QUEUE_CAPACITY, DELAY_CAPACITY, DELAY_VALUE, MIN_SPAWN_AGENTS_VALUE, MAX_SPAWN_AGENTS_VALUE, WORK_INTERVAL_VALUE, STATISTIC_INTERVAL_VALUE, addElementsInList, getPreviousElementsList, settingNextElementsInSequence, INetworElementState, ICurrentState, IStateInfoField, getRandomArbitrary, combineArray, IModelStateInfo, TModelsLastStateInfo, ServerMessageTypes, TAgentsStatesInfo, TModelStatesInfo} from "../../utils/constants";

// export const board = new Board();

// export const createModels = (): void => {
//     board.clearModels();

//     for (let index = 0; index < MODELS_COUNT_VALUE; index++) {
//         const newModel = new Model();

//         const sourceElements: SourceElement[] = [];
//         const networkElements: NetworkElement[] = [];
//         const queueElements: QueueElement[] = [];
//         const delayElements: DelayElement[] = [];

//         const sourceElement = new SourceElement();
//         const queueElement = new QueueElement();
//         const delayElement = new DelayElement();
//         const sinkElement = new SinkElement();

//         addElementsInList(sourceElements, sourceElement);
//         addElementsInList(networkElements, sourceElement, queueElement, delayElement, sinkElement);
//         addElementsInList(queueElements, queueElement);
//         addElementsInList(delayElements, delayElement);

//         sourceElement.setPreviousElements(getPreviousElementsList());
//         queueElement.setPreviousElements(getPreviousElementsList(sourceElement));
//         delayElement.setPreviousElements(getPreviousElementsList(queueElement));
//         sinkElement.setPreviousElements(getPreviousElementsList(delayElement));

//         settingNextElementsInSequence(networkElements);

//         queueElement.setCapacity(QUEUE_CAPACITY);
//         delayElement.setCapacity(DELAY_CAPACITY);

//         queueElement.sendListenerInit();
//         delayElement.setDelayValue(DELAY_VALUE);

//         newModel.setSourceElements(sourceElements);
//         newModel.setNetworkElements(networkElements);
//         newModel.setQueueElements(queueElements);
//         newModel.setDelayElements(delayElements);

//         board.addModelToBoard(newModel);

//         console.log("\nCREATE SUCCESS\n");
//     }

// }

// const modelsIntervalAction = (): void => {
//     const modelsList = board.getModelsList();
//     let workTime = board.getWorkTime();
//     const modelsStatistic = board.getStatistic();
//     const allModelsStatesInfo = modelsStatistic.getAllModelsStatesInfo();

//     modelsList.forEach((model) => {
//         model.spawnAgents();
//     }
//     );

//     workTime += WORK_INTERVAL_VALUE;
//     board.setWorkTime(workTime);

//     console.log(`\n\nWORK TIME: ${workTime} ms\n`);


//     modelsList.forEach((model, modelIndex) => {
//         let networkElements = model.getNetworkElements();
//         let modelCurrentStateInfo = model.getModelStateInfo(workTime, networkElements);

//         if (allModelsStatesInfo.length < modelsList.length) {
//             const modelsStatesInfoElement: TModelStatesInfo = [];
//             modelsStatesInfoElement.push(modelCurrentStateInfo);

//             allModelsStatesInfo.push(modelsStatesInfoElement);

//             return;
//         }

//         console.log("\n\n\n\nMODELS ACTION INTERVAL CHECK PREVIOUS PUSH:\n")
//         console.log("ALL MODELS STATES: \n");
//         console.log(modelsStatistic.getAllModelsStatesInfo());
    
//         console.log("\n\n\n\nSENT MODELS STATES: \n");
//         console.log(modelsStatistic.getSentModelsStatesInfo());

//         allModelsStatesInfo[modelIndex].push(modelCurrentStateInfo);

//         console.log("\n\n\n\nMODELS ACTION INTERVAL CHECK AFTER PUSH:\n")
//         console.log("ALL MODELS STATES: \n");
//         console.log(modelsStatistic.getAllModelsStatesInfo());
    
//         console.log("\n\n\n\nSENT MODELS STATES: \n");
//         console.log(modelsStatistic.getSentModelsStatesInfo());
//     });

//     modelsStatistic.setAllModelsStatesInfo(allModelsStatesInfo);
// }

// const statisticIntervalAction = (): void => {
//     const modelsStatistic = board.getStatistic();

//     const needSendModelsStatesInfo = modelsStatistic.getNeedSendModelsStatesInfo();
//     const needSendCompletedAgentsStatesInfo = modelsStatistic.getNeedSendCompletedAgentsStatesInfo();
    
//     // console.log("\n\n\n\nSTATISTIC INTERVAL CHECK:\n")
//     // console.log("ALL MODELS STATES: \n");
//     // console.log(modelsStatistic.getAllModelsStatesInfo());

//     // console.log("\n\n\n\nSENT MODELS STATES: \n");
//     // console.log(modelsStatistic.getSentModelsStatesInfo());

//     modelsStatistic.updateSentModelsStatesInfo(needSendModelsStatesInfo);
//     modelsStatistic.updateSentCompletedAgentsStatesInfo(needSendCompletedAgentsStatesInfo);

//     // console.log("\n\n\n\nUPDATED SENT MODELS STATES: \n");
//     // console.log(modelsStatistic.getSentModelsStatesInfo());

//     // sendMessageAllClients(ServerMessageTypes.MODELS_STATES, needSendModelsStatesInfo);
//     // sendMessageAllClients(ServerMessageTypes.SERVICE_COMPLETED_AGENTS, needSendCompletedAgentsStatesInfo);
// }

// export const startModels = (): void => {
//     const isModelsStart = board.getIsModelStart();

//     if (isModelsStart) {
//         return;
//     }

//     board.setModelsWorkTimer(setInterval(board.modelsIntervalAction, WORK_INTERVAL_VALUE));
//     board.setSendModelsStatisticTimer(setInterval(statisticIntervalAction, STATISTIC_INTERVAL_VALUE));

//     board.setIsModelsStop(false);
//     board.setIsModelsStart(true);

//     console.log("\nSTART SUCCESS\n");
// }

// export const clearModelsData = (): void => {
//     const modelsList = board.getModelsList();

//     modelsList.forEach((model) => {
//         const networkElements = model.getNetworkElements();
//         const queueElements = model.getQueueElements();

//         networkElements.forEach((element) => {
//             element.setAgentsCameCount(0);
//             element.setAgentsCount(0);
//             element.setAgentsLeftCount(0);
//         });

//         queueElements.forEach((element) => {
//             element.setAgentsLostCount(0);
//         });

//         model.setNetworkElements(networkElements);
//     });

//     board.setModelsList(modelsList);
//     board.setWorkTime(0);
// }

// export const stopModels = (): void => {
//     const isModelsStop = board.getIsModelStop();
//     const modelsWorkTimer = board.getModelsWorkTimer();
//     const sendModelsStatisticTimer = board.getSendModelsStatisticTimer();
//     const modelsList = board.getModelsList();

//     if (isModelsStop) {
//         return;
//     }

//     if (!modelsWorkTimer || !sendModelsStatisticTimer) {
//         throw new Error("Cannot stop models, models has not been started yet");
//     }

//     clearInterval(modelsWorkTimer);
//     clearInterval(sendModelsStatisticTimer);

//     modelsList.forEach((model) => {
//         let delayElements = model.getDelayElements();
//         let queueElements = model.getQueueElements();

//         delayElements.forEach((element) => {
//             element.stop();
//         })

//         queueElements.forEach((element) => {
//             element.stop();
//         });

//         model.setDelayElements(delayElements);
//         model.setQueueElements(queueElements);
//     })

//     clearModelsData();

//     board.setIsModelsStart(false);
//     board.setIsModelsStop(true);

//     console.log("\nSTOP SUCCESS\n");
// }
