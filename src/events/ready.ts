import { ApplicationCommandPermissionData } from "discord.js";
import BotEvent from "../structures/BotEvent";

export default {
    name: 'ready',

    async execute(bot) {
        console.log(`Logged in as ${bot.user?.tag}!`);
        let guild = await bot.guilds.fetch(bot.config.serverID);
        guild.commands.set(bot.commands.map(e => e.getSlashCommandJSON())).then(cmds => {
            console.log('Loaded commands!')

            // // load command permissions
            // bot.commands.forEach(cmd => {
            //     let permissions: ApplicationCommandPermissionData[] = [];
            //     if (cmd.devOnly) permissions.push(...bot.config.developers.map((e): ApplicationCommandPermissionData => ({ id: e, type: 'USER', permission: true })));
            //     if (cmd.adminOnly) permissions.push({
            //         id: '963804083557400667',
            //         type: 'ROLE',
            //         permission: true
            //     });


            //     if (permissions.length) {
            //         console.log(permissions, cmd.name)
            //         permissions.push({ id: guild.roles.everyone.id, type: "ROLE", permission: false })
            //         cmds.find(e => e.name == cmd.name)?.permissions.set({ permissions: permissions });
            //     }

            // })


        })
    }
} as BotEvent