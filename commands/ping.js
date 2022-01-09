const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test ping'),
  async execute(interaction, client) {
    interaction.reply({ content: "ping" })

  }
};