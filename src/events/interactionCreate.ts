import { CommandInteraction, GuildMember, User } from "discord.js";
import OmenEvent from "../structures/BotEvent";
import CommandInteractionContext from "../structures/CommandInteractionContext";
import { CommandInteractionWithMember } from "../structures/Command";
import { BotUser } from "../structures/BotUser";
import BotEvent from "../structures/BotEvent";
import { rawServerConfig, ServerConfig } from "../structures/ServerConfig";
import { UserConfig } from "../structures/UserConfig";


export default <BotEvent>{
    name: 'interactionCreate',
    async execute(bot, interaction: CommandInteraction<"cached">) {
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return;
        if (!interaction.member || !(interaction.member instanceof GuildMember)) return


        const command = bot.commands.find((cmd) => cmd.name == interaction.commandName);

        // console.log(bot.commands)
        if (command) {

            // if (command.devOnly && interaction.user.tag !== 'SimplyNo#8524') return;
            console.log(`${interaction.user.tag} used command: ${command.name}`);
            if (command.options.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ ephemeral: true, content: `You don't have permission to use this command!` });
            if (command.options.devOnly && !bot.hasDev(interaction.user.id)) return interaction.reply({ ephemeral: true, content: `You don't have permission to use this command!` });
            let ctx: CommandInteractionContext = {
                server: new ServerConfig(interaction.guild.id),
                user: new UserConfig(interaction.user.id),
            }
            // interaction.serverConfig = bot.getServerSettings(interaction.guild.id);
            // interaction.user 
            command.execute(interaction, ctx, bot)

        }

    }
}