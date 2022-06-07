import { defaultServerConfig, rawServerConfig } from "./ServerConfig";
import * as Discord from "discord.js"
export class Server {
    config: rawServerConfig;
    constructor(public id: string, config: Partial<rawServerConfig>, public guild: Discord.Guild) {
        // constructor code
        this.config = Discord.Util.mergeDefault(defaultServerConfig, config) as rawServerConfig;
    }
    setConfig(config: Partial<rawServerConfig>) {
        throw new Error("Method not implemented");
    }

}   