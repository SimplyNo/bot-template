import { Util } from "discord.js"
import { serverConfig } from "../Bot"

export interface rawServerConfig {
    // server config structure
    testConfig: string
}
export const defaultServerConfig: Partial<rawServerConfig> = {
    // default user config goes here
    testConfig: "hellooooo"
}
// config information for configurable settings
type configurableSettings = {
    [key: string]: {
        description: string,
        type: "string" | "channel" | "role" | "integer" | "messageID" | "boolean",
        array?: boolean
    }
}
export const serverSettingsType: configurableSettings = {
    testConfig: {
        description: "Nice little message.",
        type: "string",
    }
}
export class ServerConfig {
    config: rawServerConfig;
    rawConfig: Partial<rawServerConfig>;
    constructor(public id: string) {
        let config = serverConfig.get(id) || {};
        this.rawConfig = config;
        this.config = Util.mergeDefault(defaultServerConfig, config) as rawServerConfig;
    }
    setConfig(config: Partial<rawServerConfig>) {
        serverConfig.set(this.id, { ...this.rawConfig, ...config })
        return this;
    }
    deleteConfig(config: string) {
        serverConfig.delete(this.id, config);
        return this;
    }
    deleteAllConfig() {
        serverConfig.delete(this.id);
        return this;
    }

}