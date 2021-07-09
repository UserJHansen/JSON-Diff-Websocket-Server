import { APIServer } from "./Modules/APIServer.ts";
// import { MessageHandler } from "./Modules/XMLModule.ts";
import { MessageHandler } from "./Modules/JSONModule.ts";
import { CommandHandler } from "./Modules/CommandHandler.ts";

var Server = new APIServer(8080, ["http://localhost:45255/test.json"], MessageHandler, CommandHandler, 1000)

Server.startServer(); 