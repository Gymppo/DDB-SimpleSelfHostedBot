const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick user')
        .addStringOption(option =>
            option.setName('member')
                .setDescription('Membre mention')
                .setRequired(true)),
    async execute(interaction, client) {
        let member = client.guilds.cache.get('809906388410957824').members.cache.get(interaction.options._hoistedOptions[0].value.replace('<@!', '').replace('>', ''))
        if (!member) return interaction.reply({ content: "❌ Veuillez préciser un membre correct (mention)" })
        if (member.id === client.user.id) return interaction.reply({ content: "❌ Je ne peux pas me ban" })
        if (member.id === interaction.member.user.id) return interaction.reply({ content: "❌ Vous ne pouvez pas vous ban" })
        member.kick()
    }
};