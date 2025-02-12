import DelayElement from "../../domains/DelayElement";
import QueueElement from "../../domains/QueueElement";
import { TLostSinkElement } from "../../domains/QueueElement/meta";
import SinkElement from "../../domains/SinkElement";
import SourceElement from "../../domains/SourceElement";
import { DEFAULT_USED_DISK_SPACE, DELAY_CAPACITY, DELAY_VALUE, getRandomArbitrary, WORK_INTERVAL_VALUE } from "../../utils/constants";
import { MILLISECONDS_MULTIPLIER } from "./meta";

export const MIN_DEFAULT_MEMORY_USAGE: number = 0.23;
export const MAX_DEFAULT_MEMORY_USAGE: number = 0.27;

class ControllerParametersService {
    public static getUsedDiskSpace(queueElements: QueueElement[]): number {
        const usedDiskSpace = DEFAULT_USED_DISK_SPACE;
        // const queuesAgentsCountSum: number = queueElements.reduce((sum, queueElement) => sum + queueElement.getAgentsCount(), 0);
        // const queuesCapacitiesSum: number = queueElements.reduce((sum, queueElement) => sum + queueElement.getCapacity(), 0);
        
        // return queuesAgentsCountSum / queuesCapacitiesSum;

        return usedDiskSpace;
    }

    public static getMemoryUsage(queueElements: QueueElement[], delayElements: DelayElement[]): number {
        const defaultMemoryUsage: number = getRandomArbitrary(MIN_DEFAULT_MEMORY_USAGE, MAX_DEFAULT_MEMORY_USAGE);

        const queueElementsAgentsCount: number = queueElements.reduce((agentsCount, queueElement) => agentsCount + queueElement.getAgentsCount(), 0);
        const delayElementsAgentsCount: number = delayElements.reduce((agentsCount, delayElement) => agentsCount + delayElement.getAgentsCount(), 0);

        const queueElementsCapacitySum: number = queueElements.reduce((capacitySum, queueElement) => capacitySum + queueElement.getCapacity(), 0);
        const delayElementsCapacitySum: number = delayElements.reduce((capacitySum, delayElement) => capacitySum + delayElement.getCapacity(), 0);

        const agentsMemoryUsageMultiplier: number = 1 - defaultMemoryUsage;   
        
        return defaultMemoryUsage + (queueElementsAgentsCount + delayElementsAgentsCount) * agentsMemoryUsageMultiplier / (queueElementsCapacitySum + delayElementsCapacitySum);
    }

    public static getNetworkTraffic(sourceElements: SourceElement[]): number {
        return sourceElements.reduce((networkTraffic, sourceElement) => networkTraffic + sourceElement.getReceiptIntensity(), 0);
    }

    public static getPacketLost(modelSinkElement: SinkElement, queueElements: QueueElement[]): number {
        const lostSinkElements: TLostSinkElement[] = queueElements.map((queueElement) => queueElement.getLostSinkElement());

        const lostAgentsCount: number = lostSinkElements.reduce((lostAgentsCount, lostSinkElement) => {
            if (!lostSinkElement) {
                return lostAgentsCount + 0;
            }

            return lostAgentsCount + lostSinkElement.getAgentsCameCount();
        }, 0);
        const servicedAgentsCount: number = modelSinkElement.getAgentsCameCount();

        return servicedAgentsCount === 0 ? 0 : lostAgentsCount / servicedAgentsCount;
    }

    public static getPing(servicedSinkElement: SinkElement): number {
        const lastAgentCameTime: number = servicedSinkElement.getStatisticForController().lastAgentCameTime;
        const lastAgentLeftTime: number = servicedSinkElement.getStatisticForController().lastAgentLeftTime;

        return lastAgentLeftTime - lastAgentCameTime;
    }

    public static getJitter(servicedSinkElement: SinkElement): number {
        const previousAgentLeftTime: number = servicedSinkElement.getStatisticForController().previousAgentLeftTime;
        const lastAgentLeftTime: number = servicedSinkElement.getStatisticForController().lastAgentLeftTime;

        return lastAgentLeftTime - previousAgentLeftTime;
    }

    public static getCPU(sourceElements: SourceElement[]): number {
        const receiptIntensity: number = this.getNetworkTraffic(sourceElements) / (WORK_INTERVAL_VALUE / DELAY_VALUE);
        
        const loadFactor: number = receiptIntensity * (DELAY_VALUE / MILLISECONDS_MULTIPLIER) / DELAY_CAPACITY;

        return loadFactor <= 1 ? loadFactor : 1;
    }
}

export default ControllerParametersService;