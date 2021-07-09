// deno-lint-ignore-file no-explicit-any

export function hasJsonStructure(str: string) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch {
        return false;
    }
}

import XMLParse from "https://denopkg.com/nekobato/deno-xml-parser/index.ts";
export function hasXMLStructure(str: string) {
    try {
        XMLParse(str);
    } catch  {
        return false;
    }

    return true;
}

// Thanks to LoDash for this code
export function compact(array: Array<any>): Array<any> {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
        const value = array[index];
        if (value) {
            result[resIndex++] = value;
        }
    }
    return result;
}

import { APIcommand } from "./APIDefinitions/APIcommands.ts";
export function validateMessage(message: APIcommand) {
    return message.command !== undefined &&
           typeof message.command === "number" && !Number.isNaN(message.command) &&
           message.area !== undefined &&
           typeof message.area === "number" && !Number.isNaN(message.area) &&
           message.value !== undefined &&
           typeof message.value === "string" || typeof message.value === "object" || typeof message.value === "number"
        ;
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export class buildCommandfromXML implements APIcommand{
    command = -1;
    area = -1;
    value?: string | Array<string> | Array<number>;
    constructor(XML: any[]) {
        let i;
        const temparr = [];
        
        for (i = 0; i < XML.length; i++) {
            temparr[XML[i].name] = XML[i].content
        }

        // this.type = temparr.type;
        // this.area = temparr.area;
        // this.value = temparr.value;
        
        if (temparr[<any>"type"] !== undefined && temparr[<any>"area"] !== undefined && temparr[<any>"value"] !== undefined) {
            try {
                this.command = Number(temparr[<any>"type"]);
                this.area = Number(temparr[<any>"area"]);
                this.value = temparr[<any>"value"];
            } catch {
                throw new Error("Please provide a valid Command (It looks like you may have used strings instead of numbers)");
            }
        } else 
            throw new Error("Please provide a valid Command");
    }
}

export function RemoveFromArray(array: number[] | string[] | any[], toRemove: any) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === toRemove)
            array.splice(i, 1);
    }
}

export function createUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
} 

// https://github.com/taisukef/denolib/blob/master/nodelikeassert.mjs
export function deepEquals(x: any, y: any) {
    if (x === y) { return true; }
    if (!(x instanceof Object) || !(y instanceof Object)) { return false; }
    if (x.constructor !== y.constructor) { return false; }
    for (const p in x) {
        // deno-lint-ignore no-prototype-builtins
        if (!x.hasOwnProperty(p)) { continue; }
        // deno-lint-ignore no-prototype-builtins
        if (!y.hasOwnProperty(p)) { return false; }
        if (x[p] === y[p]) { continue; }
        if (typeof (x[p]) !== "object") { return false; }
        if (!deepEquals(x[p], y[p])) { return false; }
    }
    for (const p in y) {
        // deno-lint-ignore no-prototype-builtins
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) { return false; }
    }
    return true;
}
