import { GuildMember } from "discord.js";
import { Server } from "./Server";
import { BotUser } from "./BotUser";
import { ServerConfig } from "./ServerConfig";
import { UserConfig } from "./UserConfig";

export default interface CommandInteractionContext {
    server: ServerConfig,
    user: UserConfig
}