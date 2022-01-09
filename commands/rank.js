const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageAttachment, MessageCollector, MessageButton } = require('discord.js')
const Levels = require("discord-xp");
const canvacord = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Affiche ton niveau'),
    async execute(interaction, client) {
        Levels.createUser(interaction.member.user.id, interaction.member.guild.id);
        let data = await Levels.fetch(interaction.member.user.id, interaction.member.guild.id, true);
        let required = Levels.xpFor(data.level + 1);
        const rank = new canvacord.Rank()
            .setAvatar(interaction.member.user.displayAvatarURL({ format: 'png' }))
            .setCurrentXP(data.xp)
            .setRequiredXP(required)
            .setStatus(client.guilds.cache.get(interaction.member.guild.id).members.cache.get(interaction.member.user.id).presence.status)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(interaction.member.user.username)
            .setDiscriminator(interaction.member.user.discriminator);

        rank.build()
            .then(dat => {
                const attachment = new MessageAttachment(dat, "RankCard.png");
                interaction.reply({
                    files: [attachment]
                })

            })


    }
};