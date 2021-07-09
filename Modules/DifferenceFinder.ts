// deno-lint-ignore-file no-explicit-any
import { ClientHandler } from "./ClientHandler.ts"
import { APIClient } from "../APIDefinitions/APIClient.ts"
import { GetDiff } from "https://raw.githubusercontent.com/UserJHansen/recursive-diff-deno/master/src/recursive-diff.js";

interface referenceObject { 
    numberOfUsers: number;
    url: string;
    cookies:string;
    previousResult:string;
}

export default class DifferenceFinder {
    private referenceTable: referenceObject[] = [];
    private clientHandler: ClientHandler;
    public whitelist: string[] = [];

    constructor(whitelist: string[], clientHandler: ClientHandler, pollTime: number) {
        this.whitelist = whitelist;
        this.clientHandler = clientHandler;
        setInterval(() => {this.pollFunction(this)}, pollTime);
    }

    async pollFunction(thisClone: DifferenceFinder){
        for (const Website in thisClone.referenceTable) {
            if (thisClone.referenceTable[Website].numberOfUsers > 0) {
                const result = await thisClone.MakeRequest(thisClone.referenceTable[Website].url, thisClone.referenceTable[Website].cookies)

                if (result === thisClone.referenceTable[Website].previousResult) continue;

                try {
                    const earlierResult = JSON.parse(thisClone.referenceTable[Website].previousResult);
                    const currentResult = JSON.parse(result)

                    const Diff = GetDiff(earlierResult, currentResult)

                    for (const urlid in thisClone.clientHandler.URLs[<any>thisClone.referenceTable[Website].url]) {
                        const id = (<any>thisClone.clientHandler.URLs[<any>thisClone.referenceTable[Website].url])[urlid]
                        if (typeof thisClone.clientHandler.clients[<any>id] != "undefined")
                            if ((<APIClient[]>thisClone.clientHandler.clients)[<any>id].Cookies == thisClone.referenceTable[Website].cookies)
                                (<APIClient[]>thisClone.clientHandler.clients)[<any>id].send(JSON.stringify({ status: "NEW DIFF", message: Diff }))
                    }
                    thisClone.referenceTable[Website].previousResult = result
                } catch (e) {
                    for (const urlid in thisClone.clientHandler.URLs[<any>thisClone.referenceTable[Website].url]) {
                        const id = (<any>thisClone.clientHandler.URLs[<any>thisClone.referenceTable[Website].url])[urlid]
                        if (typeof thisClone.clientHandler.clients[<any>id] != "undefined")
                            if ((<APIClient[]>thisClone.clientHandler.clients)[<any>id].Cookies == thisClone.referenceTable[Website].cookies)
                                (<APIClient[]>thisClone.clientHandler.clients)[<any>id].send(JSON.stringify({ status: "FAILURE", message: "Invalid JSON. Error" + e }))
                    }
                }
            }
        }
    }
    async MakeRequest(url: string, cookies: string) {
        if (this.whitelist.includes(url)) {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "cookie": cookies
                }, 
            });
            return await response.text();
        } else {
            return ""
        }
    }
    async addClient(url: string, cookies: string) {
        cookies = cookies || "";
        if (this.referenceTable[<any>(url + "|" + cookies)])
            this.referenceTable[<any>(url + "|" + cookies)].numberOfUsers += 1;
        else
            this.referenceTable[<any>(url + "|" + cookies)] = { numberOfUsers: 1, url: url, cookies: cookies, previousResult: await this.MakeRequest(url,cookies)}
    }
    removeClient(url: string, cookies: string) {
        this.referenceTable[<any>(url + "|" + cookies)].numberOfUsers -= 1;
    }
}
 