import Command from "../../structures/Command";

export default new Command('ping')
    .setSlashCommand(cmd =>
        cmd
            .setName('ping')
            .setDescription('Ping!'))
    .onExecute((interaction, ctx, bot) => {
        interaction.reply({ content: "pong!", ephemeral: true })
    })