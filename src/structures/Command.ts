import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, GuildChannel, GuildMember, TextChannel } from "discord.js";
import Bot from "../Bot";
import CommandInteractionContext from "./CommandInteractionContext";

export interface CommandInteractionWithMember extends CommandInteraction {
    member: GuildMember,
    channel: TextChannel,
    guild: Guild
}
export type commandExecuteOptions = (Interaction: CommandInteraction<"cached">, InteractionContext: CommandInteractionContext, Bot: Bot) => void
export type CommandOptions = {
    devOnly: boolean;
    adminOnly: boolean;
    participantOnly: boolean;
    hostOnly: boolean;
}
export default class Command {
    slashCommand!: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute!: commandExecuteOptions;
    options: Partial<CommandOptions>;
    constructor(public name: string, options?: Partial<CommandOptions>) {
        if (options) this.options = options;

    }
    // setCommand
    setSlashCommand(cmd: (builder: SlashCommandBuilder) => any) {
        this.slashCommand = cmd(new SlashCommandBuilder()).setName(this.name)
        return this;
    }
    onExecute(executeCallBack: commandExecuteOptions) {
        this.execute = executeCallBack;
        return this;
    }
    getSlashCommandJSON() {
        let JSON = this.slashCommand.toJSON();
        if (this.options.adminOnly || this.options.devOnly) JSON.default_permission = false;
        return JSON;
    }



}