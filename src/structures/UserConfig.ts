import { Util } from "discord.js";
import { userConfig } from "../Bot";

export interface rawUserConfig {
    testUserConfig: string
    // user config structure
}
export const defaultUserConfig: Partial<rawUserConfig> = {
    // default user config goes here
    testUserConfig: "gggggg"
}
export class UserConfig {
    readonly config: rawUserConfig;
    constructor(public id: string) {
        let config = userConfig.get(id);
        this.config = Util.mergeDefault(defaultUserConfig, config) as rawUserConfig;
    }
    setConfig<T extends keyof rawUserConfig>(key: T, newValue: rawUserConfig[T]) {
        this.config[key] = newValue;
        return this;
    }
    save() {
        userConfig.set(this.id, this.config);
        return this;
    }
}