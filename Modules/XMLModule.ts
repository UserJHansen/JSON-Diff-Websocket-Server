
// 
// This Module does not work and is more of a 'proof of concept' 
// 
// Sample Command: <APICommand><type>1</type><area>2</area><value>{1,1}</value></APICommand>
// 

import XMLParse from "https://denopkg.com/nekobato/deno-xml-parser/index.ts";
import { hasXMLStructure, validateMessage, buildCommandfromXML } from "../utility.ts";
import { APIcommand } from "../APIDefinitions/APIcommands.ts";
import { APIClient } from "../APIDefinitions/APIClient.ts";

export function MessageHandler(this: APIClient, message: string) {
    var messageXML: APIcommand
    // console.log(message);
    if (hasXMLStructure(message)) {
        if (typeof XMLParse(message).root == "undefined") {
            this.send(JSON.stringify({ status: "FAILURE", value: "Malformed Input" }));
            return;
        }
        try { 
            messageXML = new buildCommandfromXML(XMLParse(message)?.root?.children || []);
        } catch (e) {
            this.send(JSON.stringify({ status: "FAILURE", value: e.message }));
            return;
        }
        if (validateMessage(messageXML)) {
            try {
                this.CommandHandler(messageXML.command, messageXML.area, messageXML.value);
            } catch (e) {
                this.send(JSON.stringify({ status: "FAILURE", value: e.message }));
            }
        } else {
            this.send(JSON.stringify({ status: "FAILURE", value: "Malformed Input" }));
        }
    } else
        this.send(JSON.stringify({ status: "FAILURE", value: "Message not XML"}))
}