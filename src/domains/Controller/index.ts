import ControllerParametersService from "../../services/ControllerParametersService";
import { randomUUID } from "crypto";
import { CONTROLLER_CHECK_INTERVAL_TIME, TControllerID, TServicedModel, TControllerParameter, TParametersStatesList, IParametersState, MAX_PARAMETER_LOAD_VALUE, DEFAULT_PARAMETERS_DANGER_VALUE } from "./meta";
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

    public getParametersState(workTime: TBoardTime): IParametersState {
        const servicedModel = this.servicedModel;

        if (!servicedModel) {
            throw new Error("Cannot get controller parameters state, serviced model is undefined");
        }

        const modelSinkElement = servicedModel.getSinkElement();

        if (!modelSinkElement) {
            throw new Error("Cannot get controller parameters state, model sink element in undefined");
        }

        return {
            time: workTime,
            CPU: ControllerParametersService.getCPU(servicedModel.getSourceElements()),
            usedDiskSpace: ControllerParametersService.getUsedDiskSpace(servicedModel.getQueueElements()),
            memoryUsage: ControllerParametersService.getMemoryUsage(servicedModel.getQueueElements(), servicedModel.getDelayElements()),
            networkTraffic: ControllerParametersService.getNetworkTraffic(servicedModel.getSourceElements()),
            packetLost: ControllerParametersService.getPacketLost(modelSinkElement, servicedModel.getQueueElements()),
            ping: ControllerParametersService.getPing(modelSinkElement),
            jitter: ControllerParametersService.getJitter(modelSinkElement),
        }
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

    public printParameters(lastParametersState: IParametersState): void {
        const {time, usedDiskSpace, memoryUsage, networkTraffic, packetLost, ping, jitter, CPU} = lastParametersState;

        console.log("\n\n\n");
        console.log(`Model ID: ${this.servicedModel?.getID()}\n`);
        console.log("TIME: ", time);
        console.log("USED DISK SPACE: ", usedDiskSpace);
        console.log("MEMORY USAGE: ", memoryUsage);
        console.log("NETWORK TRAFFIC: ", networkTraffic);
        console.log("PACKET LOST: ", packetLost);
        console.log("PING: ", ping);
        console.log("JITTER: ", jitter);
        console.log("CPU: ", CPU);
        console.log();
    }

    public checkIntervalAction(): void {
        this.workTime += CONTROLLER_CHECK_INTERVAL_TIME;

        const newParametersState = this.getParametersState(this.workTime)

        this.parametersStatesList.push(newParametersState);

        this.printParameters(newParametersState);
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

    public getParametersAmount(workTime: TBoardTime, maxSpawnAgentsValue: number, pingDangerValue: number, jitterDangerValue: number): number {
        let parametersAmount: number = 0;

        const {usedDiskSpace, memoryUsage, networkTraffic, packetLost, ping, jitter, CPU} = this.getParametersState(workTime);

        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( usedDiskSpace / DEFAULT_PARAMETERS_DANGER_VALUE );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( memoryUsage / DEFAULT_PARAMETERS_DANGER_VALUE );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( networkTraffic / maxSpawnAgentsValue );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( packetLost / DEFAULT_PARAMETERS_DANGER_VALUE );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( ping / pingDangerValue );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( jitter / jitterDangerValue );
        parametersAmount += MAX_PARAMETER_LOAD_VALUE * ( CPU / DEFAULT_PARAMETERS_DANGER_VALUE );

        return parametersAmount;
    }

    public printParametersLists(): void {
        console.log("\n\n\n");
        console.log(`CONTROLLER ${this.ID}\n`)

        this.parametersStatesList.forEach((parametersState) => {
            console.log(JSON.stringify(parametersState, null, 2));
        });

        console.log();
    }
}

export default Controller;
