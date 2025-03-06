import Controller from "../Controller";
import { randomUUID } from "crypto";
import { TBoardTime } from "../meta";
import { TBalancerID } from "./meta";
import { TControllersList } from "../Board/meta";
import { getMaxElementIndex, getMinElementIndex } from "../../utils/constants";
import { ServerMessageTypes } from "../../controllers/WebSocketController/meta";

class Balancer {
    private ID: TBalancerID;
    private controllersList: TControllersList;

    constructor() {
        this.ID = randomUUID();
        this.controllersList = [];
    }

    public getID(): TBalancerID {
        return this.ID;
    }

    public getControllersList(): TControllersList {
        return this.controllersList;
    }

    public setControllersList(controllerList: TControllersList): void {
        this.controllersList = controllerList;
    }

    public addController(controller: Controller): void {
        this.controllersList.push(controller);
    }

    public printParametersLoadAmountsList(parametersLoadAmountsList: number[]): void {
        console.log("\n\n\n");
        console.log(`BALANCER ${this.ID}\n`);

        parametersLoadAmountsList.forEach((loadAmount) => {
            console.log(JSON.stringify(loadAmount, null, 2));
        });

        console.log();
    }

    public checkModelsLoadFactors(workTime: TBoardTime, sendFunction: any, delayValueToIntervalValueMultiplier: number, loadFactorDangerValue: number, maxSpawnAgentsValue: number, pingDangerValue: number, jitterDangerValue: number): void {
        let isNeedModelsLoadsAnalysis: boolean = false;

        for (let index = 0; index < this.controllersList.length; index++) {
            const currentController = this.controllersList[index];

            const servicedModel = currentController.getServicedModel();

            if (!servicedModel) {
                throw new Error("Cannot check models load factors, some controller no has serviced model");
            }

            const currentLoadFactor: number = servicedModel.getLoadFactor(workTime, delayValueToIntervalValueMultiplier);

            if (currentLoadFactor < loadFactorDangerValue) {
                continue;
            }

            isNeedModelsLoadsAnalysis = true;

            break;
        }

        if (!isNeedModelsLoadsAnalysis) {
            return;
        }

        const parametersLoadAmountsList: number[] = [];

        this.controllersList.forEach((controller) => {
            parametersLoadAmountsList.push(controller.getParametersAmount(workTime, maxSpawnAgentsValue, pingDangerValue, jitterDangerValue));
        });

        const mostLoadedControllerIndex = getMaxElementIndex(parametersLoadAmountsList);
        const leastLoadedControllerIndex = getMinElementIndex(parametersLoadAmountsList);


        const mostLoadedController = this.controllersList[mostLoadedControllerIndex]!;
        const leastLoadedController = this.controllersList[leastLoadedControllerIndex]!;
        const recipientModel = leastLoadedController.getServicedModel();

        if (!recipientModel) {
            throw new Error("Cannot defined recipient model for move source element, serviced model is udefined");
        }

        mostLoadedController.movedServicedModelSinkElement(recipientModel, sendFunction, mostLoadedControllerIndex, leastLoadedControllerIndex);

        this.printParametersLoadAmountsList(parametersLoadAmountsList);
    }
}

export default Balancer;