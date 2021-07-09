// deno-lint-ignore-file no-explicit-any

import { APIClient } from "../APIDefinitions/APIClient.ts";
import DifferenceFinder from "./DifferenceFinder.ts";
import { RemoveFromArray } from "../utility.ts";
 
export class ClientHandler {
    public clients: Array<APIClient|undefined> = [];
    public differenceFinder: DifferenceFinder;
    public Watches: Array<Array<Array<number>>> = []
    public Subscriptions: Array<Array<string>> = [];
    public URLs: Array<Array<number>|undefined> = [];
    public whitelist: Array<string> = []

    constructor(whitelist: Array<string>, pollTime: number) {
        this.differenceFinder = new DifferenceFinder(whitelist, this, pollTime)
        this.whitelist = whitelist;
    }

    addClient(client: APIClient, MessageHandler: (this: APIClient, message: string) => void, CommandHandler: (Command: number, Area: number, Value?: string | Array<string> | Array<number>) => void, id = -1): number {
        if (id == -1) {
            id++;
            while (this.clients[id] !== undefined) {
                id++;
            }
        }
        client.id = id;
        client.on("message", MessageHandler);
        client.on("close", this.CloseCallback);
        client.whitelist = this.whitelist;
        client.CommandHandler = CommandHandler;
        client.Parent = this;
        client.Cookies = "";

        client.send("Welcome to the Web Monitor WebSocket API");

        this.clients[id] = client;
        return id;
    }

    CloseCallback(this: APIClient) {
        if (this.Parent) {
            this.Parent.clients[this.id] = undefined;

            if (this.URL) {
                this.Parent.differenceFinder.removeClient(this.URL, this.Cookies)
                RemoveFromArray(this.Parent.URLs[<any>this.URL] || [], this.id)
                if (this.Parent.URLs[<any>this.URL] == []) {
                    this.Parent.URLs[<any>this.URL] = undefined;
                }
            }
        }
    }
}