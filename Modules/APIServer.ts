import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { APIClient } from "../APIDefinitions/APIClient.ts";
import { ClientHandler } from "./ClientHandler.ts";


export class APIServer {
    private wss: WebSocketServer;
    private clients;
    private MessageHandler: (this: APIClient, message: string) => void;
    private CommandHandler: (Command: number, Area: number, Value?: string | Array<string> | Array<number>) => void;
    public whitelist: Array<string>;
    public pollTime: number;
    

    constructor(port: number, whitelist: Array<string>, MessageHandler: (this: APIClient, message: string) => void, CommandHandler: (Command: number, Area: number, Value?: string | Array<string> | Array<number>) => void, pollTime: number) {
        this.wss = new WebSocketServer(port);
        this.whitelist = whitelist;
        this.MessageHandler = MessageHandler;
        this.CommandHandler = CommandHandler;
        this.pollTime = pollTime;

        this.clients = new ClientHandler(this.whitelist, pollTime)
    }
    
    startServer() {
        this.wss.on("connection", (ws: APIClient) => {
            this.clients.addClient(ws, this.MessageHandler, this.CommandHandler);
        });
    }
    stopServer(){
        this.wss.close();
        this.clients = new ClientHandler(this.whitelist, this.pollTime);
    }
} 

