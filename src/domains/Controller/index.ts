import { randomUUID } from "crypto";
import ControllerParametersService from "../../services/ControllerParametersService";
import { TModelsInterval, TWorkTime } from "../../utils/constants";
import { CONTROLLER_CHECK_INTERVAL_TIME, TControllerID, TServicedModel } from "./meta";
import QueueElement from "../QueueElement";

class Controller {
    private ID: TControllerID;
    private servicedModel: TServicedModel;
    private workTime: TWorkTime;
    private checkTimer: TModelsInterval;
    private timeList: number[];
    private CPUList: number[];
    private usedDiskSpaceList: number[];
    private memoryUsageList: number[];
    private networkTrafficList: number[];
    private packetLostList: number[];
    private pingList: number[];
    private jitterList: number[];

    constructor() {
        this.ID = randomUUID();
        this.servicedModel = null;
        this.workTime = 0;
        this.checkTimer = null;
        this.timeList = [];
        this.CPUList = [];
        this.usedDiskSpaceList = [];
        this.memoryUsageList = [];
        this.networkTrafficList = [];
        this.packetLostList = [];
        this.pingList = [];
        this.jitterList = [];
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

    public getCPUList(): number[] {
        return this.CPUList;
    }

    public getUsedDiskSpaceList(): number[] {
        return this.usedDiskSpaceList;
    }

    public getMemoryUsageList(): number[] {
        return this.memoryUsageList;
    }

    public getNetworkTrafficList(): number[] {
        return this.networkTrafficList;
    }

    public getPacketLostList(): number[] {
        return this.packetLostList;
    }

    public getPingList(): number[] {
        return this.pingList;
    }

    public getJitterList(): number[] {
        return this.jitterList;
    }

    public setServicedModel(servicedModel: TServicedModel): void {
        this.servicedModel = servicedModel;
    }

    public setCheckTimer(checkTimer: TModelsInterval): void {
        this.checkTimer = checkTimer;
    }

    public setCPUList(cpuList: number[]): void {
        this.CPUList = cpuList;
    }

    public setUsedDiskSpaceList(usedDiskSpaceList: number[]): void {
        this.usedDiskSpaceList = usedDiskSpaceList;
    }

    public setMemoryUSageList(memoryUsageList: number[]): void {
        this.memoryUsageList = memoryUsageList;
    }

    public setNetworkTrafficList(networkTrafficList: number[]): void {
        this.networkTrafficList = networkTrafficList;
    }

    public setPacketLostList(packetLostList: number[]): void {
        this.packetLostList = packetLostList;
    }

    public setPingList(pingList: number[]): void {
        this.pingList = pingList;
    }

    public setJitterList(jitterList: number[]): void {
        this.jitterList = jitterList;
    }

    public printParameters(lastTime: number, lastUsedDiskSpace: number, memoryUsage: number, lastNetworkTraffic: number, lastPacketLost: number, lastPing: number, lastJitter: number, lastCPU: number): void {
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

        this.usedDiskSpaceList.push(newUsedDiskSpace);
        this.memoryUsageList.push(newMemoryUsage);
        this.networkTrafficList.push(newNetworkTraffic);
        this.packetLostList.push(newPacketLost);
        this.pingList.push(newPing);
        this.jitterList.push(newJitter);
        this.CPUList.push(newCPU);

        this.workTime += CONTROLLER_CHECK_INTERVAL_TIME;
        this.timeList.push(this.workTime);

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
        console.log("TIME: ", this.timeList);
        console.log("USED DISK SPACE: ", this.usedDiskSpaceList);
        console.log("MEMORY USAGE: ", this.memoryUsageList);
        console.log("NETWORK TRAFFIC: ", this.networkTrafficList);
        console.log("PACKET LOST: ", this.packetLostList);
        console.log("PING: ", this.pingList);
        console.log("JITTER: ", this.jitterList);
        console.log("CPU: ", this.CPUList);
        console.log();
    }
}

export default Controller;
