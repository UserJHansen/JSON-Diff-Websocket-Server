import { hasJsonStructure, validateMessage } from "../utility.ts";
import { APIcommand } from "../APIDefinitions/APIcommands.ts";
import { APIClient } from "../APIDefinitions/APIClient.ts";

export function MessageHandler(this: APIClient, message: string) {
    // console.log(message);
    if (hasJsonStructure(message)) {
        const messageJson: APIcommand = JSON.parse(message);
        if (validateMessage(messageJson)) {
            try {
                this.CommandHandler(messageJson.command, messageJson.area, messageJson.value);
            } catch (e) {
                this.send(JSON.stringify({ status: "FAILURE", value: e.message}));
            }
        } else {
            this.send(JSON.stringify({ status: "FAILURE", value: "Malformed Input" }));
        }
    } else
        this.send(JSON.stringify({ status: "FAILURE", value: "Message not JSON" }));
} 