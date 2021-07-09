// deno-lint-ignore-file no-explicit-any

import { Command, Area } from "../APIDefinitions/APIcommands.ts";
import { APIClient } from "../APIDefinitions/APIClient.ts"
import { RemoveFromArray } from "../utility.ts" 
 
export async function CommandHandler(this: APIClient, command: number, area: number, value?: string | Array<string> | Array<number>): Promise<void> {
    if (this.Parent) {
        switch (command) {
            case Command.GET:
                switch (area) {
                    case Area.URL:
                        this.send(JSON.stringify({ status: "SUCCESS", message: this.URL }))
                        break;
                    case Area.FullListStats:
                        if (this.URL)
                            this.send(JSON.stringify({ status: "SUCCESS", message: await this.Parent.differenceFinder.MakeRequest(this.URL,this.Cookies) }))
                        else
                            this.send(JSON.stringify({ status: "FAILURE", value: "No URL selected" }));
                        break;
                    case Area.Cookies:
                        this.send(JSON.stringify({ status: "SUCCESS", message: this.Cookies }))
                        break;
                    default:
                        this.send(JSON.stringify({ status: "FAILURE", value: "Unsupported Command" }));
                }
                break;
            case Command.SET:
                switch (area) {
                    case Area.URL:
                        if (typeof value == "string") {
                            if (this.whitelist.includes(value)) {
                                this.Parent.URLs[<any>value] = this.Parent.URLs[<any>value] || []
                                
                                if (this.URL) {
                                    this.Parent.differenceFinder.removeClient(this.URL, this.Cookies)
                                    RemoveFromArray(this.Parent.URLs[<any>value] || [], this.id)
                                    if (this.Parent.URLs[<any>value] == []) {
                                        this.Parent.URLs[<any>value] = undefined;
                                    }
                                }
                                (this.Parent.URLs[<any>value] || []).push(this.id)

                                this.URL = value;
                                this.Parent.differenceFinder.addClient(this.URL, this.Cookies)

                                this.send(JSON.stringify({ status: "SUCCESS", message: "" }))
                            } else
                                this.send(JSON.stringify({ status: "FAILURE", message: "Not on Whitelist" }));
                        } else
                            this.send(JSON.stringify({ status: "FAILURE", message: "Unsupported Command" }));
                        break;
                    case Area.Cookies:
                        if (typeof value == "string") {
                            if (this.URL)
                                this.Parent.differenceFinder.removeClient(this.URL, this.Cookies)
                            this.Cookies = value;
                            if (this.URL)
                                this.Parent.differenceFinder.addClient(this.URL, this.Cookies)
                            this.send(JSON.stringify({ status: "SUCCESS", message: "" }))
                        } else
                            this.send(JSON.stringify({ status: "FAILURE", message: "Bad Command" }));
                        break;
                    default:
                        this.send(JSON.stringify({ status: "FAILURE", value: "Unsupported Command" }));
                }
                break;
            default:
                this.send(JSON.stringify({ status: "FAILURE", value: "Unsupported Command" }));
        }

    }
}