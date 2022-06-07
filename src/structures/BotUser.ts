import { defaultUserConfig, rawUserConfig } from "./UserConfig";
import * as Discord from "discord.js"
export class BotUser {
    config: rawUserConfig;
    constructor(public id: string, config: Partial<rawUserConfig>, public discordUser: Discord.User) {
        // constructor code

        this.config = Discord.Util.mergeDefault(defaultUserConfig, config) as rawUserConfig;
    }

}   