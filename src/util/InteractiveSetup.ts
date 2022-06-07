import { Channel, Collection, GuildMember, Interaction, Message, MessageCollector, MessageEmbed, Role, TextChannel } from "discord.js";
import { bot } from "../index";
import { CommandInteractionWithMember } from "../structures/Command";
import { parseTime } from "./functions";

// export interface QuestionOptions {
//     question: string,
//     max?: number,
//     min?: number,
//     filter?: QuestionOptionsFilter
// }
export interface QuestionOption {
    name: string,
    question: string,
    filter?: QuestionOptionsFilter,
    max?: number,
    min?: number,
}
// export type QuestionOptionsWithExecutor = {
//     options: QuestionOption
// }
type questionExecutor = (data: string) => void;
// export type QuestionOptions = Collection<string, QuestionOption>;
export type QuestionOptions = {
    [option: string]: QuestionOption;
}
// type test = { [a: string]: { question: number } };
type QuestionOptionsFilter = (message: Message, answer: string) => Promise<({ data?: any, error?: string })>;
type getEmbedFilter = (currentQuestion: number, totalQuestions: number, question: string) => MessageEmbed;
type finishCallback = (data: object) => void;

export default class InteractiveSetup {
    currentQuestion = 0;
    // data: {
    //     [option in keyof T]: T[option] extends { filter: QuestionOptionsFilter } ? Awaited<ReturnType<T[option]["filter"]>> : string;
    // };
    collected: Collection<string, any> = new Collection();
    questions: QuestionOption[] = [];
    active = false;
    collector?: MessageCollector;
    finishCallback: (collection: Collection<string, any>) => void;
    constructor(public interaction: CommandInteractionWithMember, public getEmbed: getEmbedFilter, public timeout: number = 60 * 1000) {
        console.log('Initiated interactive setup.')
    }
    addQuestion(options: QuestionOption) {
        this.questions.push(options)
        return this;
    }
    start() {
        this.interaction.reply({
            content: "Starting interactive setup. Type 'cancel' at any time to stop."
        })
        this.collector = this.interaction.channel.createMessageCollector({ filter: (m) => m.author.id == this.interaction.user.id, idle: this.timeout });
        this.collector.on("collect", this.onMessage.bind(this));
        this.collector.on("end", this.onEnd.bind(this));

        this.active = true;
        this.sendNext()
        return this;
    }
    // getBaseEmbed() {
    //     this.baseEmbed
    // }
    getCurrentQuestion() {
        return this.questions[this.currentQuestion]!;
    }
    getCurrentOption() {
        return this.questions[this.currentQuestion]!;
    }
    sendNext() {
        // console.log(this.getCurrentQuestion())
        let questionObject = this.getCurrentQuestion();
        if (!questionObject) {
            this.active = false;
            this.collector?.stop("finished");

            this.finishCallback(this.collected);
        } else {
            this.interaction.channel.send({ embeds: [this.getEmbed(this.currentQuestion + 1, this.questions.length, questionObject.question)] })
        }
    }

    onFinish(callback: (collected: Collection<string, any>) => void) {
        this.finishCallback = callback;
        return this;
    }
    sendError(errorMsg: string) {
        this.interaction.channel.send(errorMsg);
    }
    private async onMessage(message: Message) {
        if (message.content.toLowerCase() == "cancel") {
            this.active = false;
            this.collector?.stop("cancelled")
        }
        // console.log(this)
        if (this.active) {
            let questionObject = this.getCurrentQuestion();
            // console.log(questionObject)


            let filterFunc = questionObject.filter;
            let filter = filterFunc ? await filterFunc(message, message.content) : { data: message.content }
            // console.log(filter)
            if (filter.error) {
                this.sendError(filter.error)
            } else if (filter.data) {
                // this.getCurrentOption().execute(filter.data);

                this.currentQuestion++;
                this.collected.set(questionObject.name, filter.data)
                this.sendNext();
            }
        }
    }
    private onEnd(collected, reason: string) {
        this.active = false;
        console.log(reason)
        if (reason.toLowerCase() == "idle") {
            this.interaction.channel.send(`Setup cancelled due to inactivity.`)
        }
        if (reason.toLowerCase() == "cancelled") {
            this.interaction.channel.send(`Setup cancelled.`)
        }
    }
    static filters = {
        /**
         * 
         * @param {(time: {ms: number,string: any;})} exec 
         * @param {*} error 
         * @returns 
         */
        DATE(exec = (time: { ms: number; string: string; }) => time.ms.toString(), error = "Invalid response! This question needed a **valid date**. Examples: `5d`, `1hr 30m`, `5m 30s`") {
            return async function (message, answer) {
                let time = parseTime(answer);
                if (!time) return { error: error }
                return { data: exec(time) }
            }
        },

        CHANNEL(exec = (channel: TextChannel) => channel.id, error = "Needs to be a valid channel!",) {
            return async function (message, answer) {
                let channel = await bot.parseChannel(answer, message.guild) as TextChannel;
                if (!channel) return { error: error };
                return { data: exec(channel) }
            }
        },
        MEMBER(exec = (member: GuildMember) => member.id, error = "Needs to be a valid member!",) {
            return async function (message, answer) {
                let member = await bot.parseMember(answer, message.guild);
                if (!member) return { error: error };
                return { data: exec(member) }
            }
        },
        ROLE(exec = (role: Role) => role.id, error = "Needs to be a valid role!",) {
            return async function (message, answer) {
                let role = await bot.parseRole(answer, message.guild);
                if (!role) return { error: error };
                return { data: exec(role) }
            }
        },
        NUMBER(options: { min?: number, max?: number } = {}, exec = (number: number) => number, error = "Needs to be a valid number!") {
            return async function (message, answer) {
                let number = parseInt(answer);
                if (isNaN(number)) return { error: error };
                if (options.min && number < options.min) return { error: `Number needs to be at least ${options.min}.` };
                if (options.max && number > options.max) return { error: `Number needs to be at most ${options.max}.` };
                return { data: exec(number) }

            }
        }
    }
}