import { TClientID, TClientSocket } from "./meta";
import WebSocket from "ws";

export class Client {
    private socket: TClientSocket;
    private isMain: boolean;
    private ID: TClientID;

    constructor() {
        this.socket = null;
        this.isMain = false;
        this.ID = null;
    }

    public getSocket():TClientSocket {
        return this.socket;
    }

    public getIsMain(): boolean {
        return this.isMain;
    }

    public getID(): TClientID {
        return this.ID;
    }

    public setSocket(webSocket: WebSocket): void {
        this.socket = webSocket;
    }
    
    public setIsMain(isMain: boolean): void {
        this.isMain = isMain;
    }

    public setID(ID: string): void {
        this.ID = ID;
    }
}