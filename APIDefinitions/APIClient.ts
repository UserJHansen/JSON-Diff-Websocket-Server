import { WebSocketAcceptedClient } from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import { ClientHandler } from "../Modules/ClientHandler.ts"

export class APIClient extends WebSocketAcceptedClient {
    id = -1; 
    whitelist: Array<string> = [];
    URL = "";
    Cookies  = "";
    CommandHandler: (Command: number, Area: number, Value?: string | Array<string> | Array<number>) => void = () => {return; };
    Parent?: ClientHandler;
}