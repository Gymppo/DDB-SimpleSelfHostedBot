const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stream')
        .setDescription('Lien du stream'),
    async execute(interaction, client) {

        interaction.reply({ content: "https://www.twitch.tv/stexhtv", ephemeral: true })


        //interaction.reply({ content: "https://www.twitch.tv/stexhtv", embeds: [{ embed: { description: "test" } }] })
    }
};