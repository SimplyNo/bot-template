import { MessageEmbed, CommandInteraction, Message, TextChannel, User, Guild } from "discord.js";


export default class Embed extends MessageEmbed {
    message?: Message;
    content?: string;

    constructor(public messageOrInteraction?: Message | CommandInteraction) {
        super();
        if (messageOrInteraction instanceof Message) {
            this.message = messageOrInteraction;
        }
        this.messageOrInteraction = messageOrInteraction;
    }
    setContent(message: string) {
        this.content = message;
        return this;
    }
    send(channelOrInteraction?: TextChannel | CommandInteraction) {
        let data = {
            content: this.content,
            embeds: [this]
        }
        if (this.messageOrInteraction instanceof CommandInteraction) {
            return this.messageOrInteraction.reply(data)
        } else if (channelOrInteraction instanceof CommandInteraction) {
            return channelOrInteraction.reply(data)
        } else {
            let channel = channelOrInteraction || this.messageOrInteraction?.channel || null;
            if (channel) {
                return channel.send(data);
            } else {
                console.error('bro, this guy sent an embed without specifying anywhere to send it to.')
            }
        }
    }
    setFancy(user: User) {
        user = user || this.messageOrInteraction?.member?.user;
        return this.setAuthor({ name: user.tag, iconURL: user.avatarURL()! });
    }
    setGuildFancy(guild: Guild) {
        guild = guild || this.messageOrInteraction?.guild;
        return this.setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
    }
}
