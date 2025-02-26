import ControllerParametersService from "../../services/ControllerParametersService";
import { randomUUID } from "crypto";
import { CONTROLLER_CHECK_INTERVAL_TIME, TControllerID, TServicedModel, TControllerParameter, TParametersStatesList } from "./meta";
import { TBoardTime } from "../meta";
import { TModelsInterval } from "../Board/meta";

class Controller {
    private ID: TControllerID;
    private servicedModel: TServicedModel;
    private workTime: TBoardTime;
    private checkTimer: TModelsInterval;
    private parametersStatesList: TParametersStatesList;

    constructor() {
        this.ID = randomUUID();
        this.servicedModel = null;
        this.workTime = 0;
        this.checkTimer = null;
        this.parametersStatesList = [];
    }

    public getID(): TControllerID {
        return this.ID;
    }

    public getServicedModel(): TServicedModel {
        return this.servicedModel;
    }

    public getCheckTimer(): TModelsInterval {
        return this.checkTimer;
    }

    public getParametersStatesList(): TParametersStatesList {
        return this.parametersStatesList;
    }

    public setServicedModel(servicedModel: TServicedModel): void {
        this.servicedModel = servicedModel;
    }

    public setCheckTimer(checkTimer: TModelsInterval): void {
        this.checkTimer = checkTimer;
    }

    public setParametersStatesList(parametersStatesList: TParametersStatesList): void {
        this.parametersStatesList = parametersStatesList;
    }

    public printParameters(lastTime: TControllerParameter, lastUsedDiskSpace: TControllerParameter, memoryUsage: TControllerParameter, lastNetworkTraffic: TControllerParameter, lastPacketLost: TControllerParameter, lastPing: TControllerParameter, lastJitter: TControllerParameter, lastCPU: TControllerParameter): void {
        console.log(`Model ID: ${this.servicedModel?.getID()}\n`);
        console.log("TIME: ", lastTime);
        console.log("USED DISK SPACE: ", lastUsedDiskSpace);
        console.log("MEMORY USAGE: ", memoryUsage);
        console.log("NETWORK TRAFFIC: ", lastNetworkTraffic);
        console.log("PACKET LOST: ", lastPacketLost);
        console.log("PING: ", lastPing);
        console.log("JITTER: ", lastJitter);
        console.log("CPU: ", lastCPU);
        console.log();
    }

    public checkIntervalAction(): void {
        if (!this.servicedModel) {
            throw new Error("Cannot controller check, serviced model is undefined");
        }

        const modelSinkElement = this.servicedModel.getSinkElement();

        if (!modelSinkElement) {
            throw new Error("Cannot controller check, model sink element in undefined");
        }

        const newUsedDiskSpace = ControllerParametersService.getUsedDiskSpace(this.servicedModel.getQueueElements());
        const newMemoryUsage = ControllerParametersService.getMemoryUsage(this.servicedModel.getQueueElements(), this.servicedModel.getDelayElements());
        const newNetworkTraffic = ControllerParametersService.getNetworkTraffic(this.servicedModel.getSourceElements());
        const newPacketLost = ControllerParametersService.getPacketLost(modelSinkElement, this.servicedModel.getQueueElements());
        const newPing = ControllerParametersService.getPing(modelSinkElement);
        const newJitter = ControllerParametersService.getJitter(modelSinkElement);
        const newCPU = ControllerParametersService.getCPU(this.servicedModel.getSourceElements());

        this.workTime += CONTROLLER_CHECK_INTERVAL_TIME;

        this.parametersStatesList.push({
            time: this.workTime,
            CPU: newCPU,
            usedDiskSpace: newUsedDiskSpace,
            memoryUsage: newMemoryUsage,
            networkTraffic: newNetworkTraffic,
            packetLost: newPacketLost,
            ping: newPing,
            jitter: newJitter,
        });

        this.printParameters(this.workTime, newUsedDiskSpace, newMemoryUsage, newNetworkTraffic, newPacketLost,newPing, newJitter, newCPU);
    }

    public start(): void {
        this.checkTimer = setInterval(() => this.checkIntervalAction(), CONTROLLER_CHECK_INTERVAL_TIME)
    }

    public stop(): void {
        if (!this.checkTimer) {
            throw new Error("Cannot stop models, models has not been started yet");
        }

        clearInterval(this.checkTimer);
    }

    public printParametersLists(): void {
        console.log(`CONTROLLER ${this.ID}\n`)
        this.parametersStatesList.forEach((parametersState) => {
            console.log(JSON.stringify(parametersState, null, 2));
        });
        console.log();
    }
}

export default Controller;
