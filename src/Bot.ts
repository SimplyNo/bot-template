import { Client, Collection, CommandInteraction, EmbedField, Guild, GuildBasedChannel, GuildTextBasedChannel, Message } from "discord.js";
import Command from "./structures/Command";
import * as CONFIG from "../config.json";
import { getAllFiles, parseMessageCodes } from "./util/functions";
import Embed from "./structures/Embed";
import Enmap from "enmap";
import { rawServerConfig } from "./structures/ServerConfig";
import { rawUserConfig } from "./structures/UserConfig";
import { Wrappers } from "./wrappers/Wrappers";

export const serverConfig = new Enmap<string, Partial<rawServerConfig>>({
    name: "serverConfig"
})
export const userConfig = new Enmap<string, Partial<rawUserConfig>>({
    name: "userConfig"
})
export default class Bot extends Client {
    commands: Collection<string, Command>;
    config = CONFIG;
    Wrappers = Wrappers;
    constructor(options) {
        super(options)
        this.commands = new Collection();
        // this.cooldowns = new Discord.Collection();
        this.config = require('../config.json');
        this.loadCommands();
        this.loadEvents();
        // this.loadIPC();

    }
    log(msg) {
        msg = parseMessageCodes(`&7[LOG] &8` + msg)
        console.log(msg);
    }
    hasDev(id: string) { return this.config.developers.includes(id) };
    createEmbed(messageOrInteraction?: Message | CommandInteraction): Embed {

        let MessageEmbed = new Embed(messageOrInteraction).setColor('#0066b6')
        // .setFooter(this.config.footer.text.replace(/%VERSION%/g, this.config.version), this.config.footer.url ?? undefined);

        return MessageEmbed;
    }
    createPagedEmbed(embed: Embed) {
        let fields = embed.fields;
        let embeds: Embed[] = [];
        let currentFields: EmbedField[] = [];
        let length = 0;
        fields.forEach((field, index) => {
            length += field.value.length;
            currentFields.push(field);
            if ((index == fields.length - 1) || (length) > 5500) {
                embeds.push(embed.setFields(currentFields));
                currentFields = [];
                length = 0;
            }
        })



    }
    createSuccessEmbed(message, text?) {
        return this.createEmbed(message)
            .setDescription(`${text || "An error occured!"}`)
            .setColor('GREEN')
        // .setAuthor({ name: `${text || "Success!"}` })
    }
    createErrorEmbed(message?, text?) {
        return this.createEmbed(message)
            .setColor('#FF0000')
            .setDescription(`${text || "An error occured!"}`)
        // .setFooter({ text: `❌ ${text || "Error"}` })
    }
    /**
     * Get the image url for a head texture
     * @param {String} uuid 
     */
    getHeadURL(uuid) {
        return `https://minotar.net/helm/${uuid}/128`
    }
    getBodyURL(uuid) {
        return `https://crafatar.com/renders/body/${uuid}?overlay=true&scale=10`
    }

    async loadCommands() {
        const files = getAllFiles("src/commands");
        for (const file of files) {
            console.log(file)
            if (!file.endsWith(".js") && !file.endsWith(".ts")) return;
            // console.log(await import(`../commands/config`))
            let command: Command = (await import(`../${file}`))?.default;
            // console.log(command)
            this.commands.set(command.name, command);
            if (!command.name) console.log(file)
        }
    }
    async loadEvents() {
        const files = getAllFiles("src/events");
        for (const file of files) {
            if (!file.endsWith(".js") && !file.endsWith(".ts")) return;
            let event = (await import(`../${file}`))?.default;
            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
        }
    }
    async parseMessage(input: string, guild: Guild) {
        let message = await Promise.all((<Collection<string, GuildTextBasedChannel>>guild.channels.cache.filter(c => c.isText())).map((channel, id) => channel.messages.fetch(input).catch(e => null))).then(c => c.filter(e => !!e)[0]);
        if (message) return message;
        return;
    }
    async parseChannel(input, guild: Guild) {
        if (!input || !guild) return;
        let channel: GuildBasedChannel | undefined;
        if (guild.channels.cache.get(input)) {
            channel = guild.channels.cache.get(input)
        } else if (guild.channels.cache.get(input.match(/\<#([0-9]*?)\>/) ? input.match(/\<#([0-9]*?)\>/)[1] : null)) {
            channel = guild.channels.cache.get(input.match(/\<#([0-9]*?)\>/)[1]);
        } else if (guild.channels.cache.find(ch => ch.name.toLowerCase() == input.toLowerCase())) {
            channel = guild.channels.cache.find(ch => ch.name.toLowerCase() == input.toLowerCase());
        }
        if (channel?.isText()) return channel;
        return;

    }

    async parseRole(input, guild: Guild) {
        // if (serverConf && serverConf.roleList) {
        //     let alias = serverConf.roleList.list.find(e => e.name.toLowerCase() == input.toLowerCase())
        //     if (alias) return guild.roles.cache.get(alias.role);
        // }
        if (!input) return undefined;
        if (guild.roles.cache.get(input)) {
            return guild.roles.cache.get(input)
        } else if (guild.roles.cache.get(input.match(/\<@&([0-9]*?)\>/) ? input.match(/\<@&([0-9]*?)\>/)[1] : null)) {
            return guild.roles.cache.get(input.match(/\<@&([0-9]*?)\>/)[1]);
        } else if (guild.roles.cache.find(r => r.name.toLowerCase() == input.toLowerCase())) {
            return guild.roles.cache.find(r => r.name.toLowerCase() == input.toLowerCase());
        }
        return undefined;

    }

    async parseMember(input: string, guild: Guild) {
        if (!input) return null;
        let match = input.match(/<@.?[0-9]*?>/);
        let mentionedID;
        if (match) {
            mentionedID = input.replace(/!/g, '').slice(2, -1)
        } else {
            mentionedID = input;
        }
        let member = await guild.members.fetch(mentionedID).catch(e => null);
        return member;
    }
}   