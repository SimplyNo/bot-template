import Bot from "../../Bot";
import Command from "../../structures/Command";
import { defaultServerConfig, rawServerConfig, serverSettingsType } from "../../structures/ServerConfig";

export default new Command('config', { adminOnly: true })
    .setSlashCommand(cmd =>
        cmd
            .setName('config')
            .setDescription('Configuration for the server.')
            .setDefaultPermission(false)
            .addSubcommand(subcmd =>
                subcmd
                    .setName('view')
                    .setDescription('view config'))
            .addSubcommand(subcmd => {
                subcmd.setName('set').setDescription('Set a config value')
                for (const prop in serverSettingsType) {
                    let value = serverSettingsType[prop];
                    let name = prop.toLowerCase();
                    if (value.array) continue;
                    console.log(value, name);
                    if (value.type === 'channel') {
                        subcmd.addChannelOption(option =>
                            option.setName(name).setDescription(value.description).addChannelType(0)
                        )
                    } else if (value.type === 'string' || value.type === 'messageID') {
                        subcmd.addStringOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type === 'boolean') {
                        subcmd.addBooleanOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type === 'integer') {
                        subcmd.addIntegerOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type == 'role') {
                        subcmd.addRoleOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    }

                }
                return subcmd;
            })
            .addSubcommand(subcmd => {
                subcmd.setName('add').setDescription('Add a config value')
                for (const prop in serverSettingsType) {
                    let value = serverSettingsType[prop];
                    let name = prop.toLowerCase();
                    if (!value.array) continue;
                    if (value.type === 'channel') {
                        subcmd.addChannelOption(option =>
                            option.setName(name).setDescription(value.description).addChannelType(0)
                        )
                    } else if (value.type === 'string' || value.type === 'messageID') {
                        subcmd.addStringOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type === 'boolean') {
                        subcmd.addBooleanOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type === 'integer') {
                        subcmd.addIntegerOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    } else if (value.type == 'role') {
                        subcmd.addRoleOption(option =>
                            option.setName(name).setDescription(value.description)
                        )
                    }

                }
                return subcmd;
            }).addSubcommand(subcmd =>
                subcmd
                    .setName('reset')
                    .setDescription('Reset a config value')
                    .addStringOption(option =>
                        option
                            .setName('configname')
                            .setDescription('The config name.')
                            .setRequired(true)
                            .addChoices(Object.keys(serverSettingsType).map(e => ([e, e])))

                    )
            )
    ).onExecute(async (interaction, ctx, bot) => {
        if (interaction.options.getSubcommand() == 'view') {
            let str = Object.entries(serverSettingsType).map(([key, value]) => `**${key}**: ${stringifyConfig(key, ctx.server.config[key], bot)}`)
            bot.createEmbed(interaction).setTitle(`Current Settings`).setDescription("Use \`/config set\` to set a config value!\n\n" + str.join('\n')).send()
        } else if (interaction.options.getSubcommand() == 'reset') {
            let option = interaction.options.getString('configname')!;
            let defaulttype = serverSettingsType[option];
            ctx.server.deleteConfig(option);
            return bot.createSuccessEmbed(interaction).setDescription(`Reset \`${option}\`.`).send()

        } else if (interaction.options.getSubcommand() == 'set') {

            let options = interaction.options.data;
            let newConfig: Partial<rawServerConfig> = {};
            let settings = Object.keys(serverSettingsType);
            for (const val of options.find(e => e.name == "set")?.options!) {
                let name = settings.find(e => e.toLowerCase() == val.name);
                if (name) {
                    let setting = serverSettingsType[name];
                    if (setting.type == "messageID") {
                        let msg = await bot.parseMessage(val.value as string, interaction.guild);
                        if (!msg) {
                            interaction.channel?.send(`Could not parse message id \`${val.value}\` for **${name}**!`);
                            continue;
                        }
                        newConfig[name] = msg?.id
                    } else {
                        newConfig[name] = val.value;
                    }
                }
            }
            if (Object.keys(newConfig).length) {
                ctx.server.setConfig(newConfig);
                let configChanged = Object.entries(newConfig).map(([key, value]) => `** ${key} **: ${stringifyConfig(key, ctx.server.config[key], bot)} → ${stringifyConfig(key, value, bot)} `)
                bot.createSuccessEmbed(interaction).setDescription(configChanged.join('\n')).send()
            } else {
                bot.createEmbed(interaction).setTitle(`No Config Changed`).setDescription(`You didn't provide any configs to changed!`).send()
            }
        }
    })



function stringifyConfig(key: keyof typeof serverSettingsType, value, bot: Bot) {
    let type = serverSettingsType[key].type;
    if (!value) return `**Unset!**`
    if (type == "channel") {
        return `<#${value}>`;
    } else if (type == "boolean") {
        return `**${value}**`
    } else if (type == "messageID") {
        return `${value}`
    } else if (type == "integer") {
        return `${value}`
    } else if (type == "role") {
        return `<@&${value}>`
    } else if (type == "string") {
        return `\`${value}\``
    }
}