const Discord = require('discord.js')
const db = require('quick.db')

const Levels = require("discord-xp");
Levels.setURL('mongodb+srv://root:Avatar06@cluster0.l4iyp.mongodb.net/test')

const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageAttachment, MessageCollector, MessageButton } = require('discord.js')
const configbot = require('./config.js')
const config = {
  CHANNEL_WELCOME: "924714455135297566",
  ROLES_WELCOME: ""
}
const Canvas = require("canvas");
const interactions = require('discord-slash-commands-client')
const fs = require('fs');
const {
  REST
} = require('@discordjs/rest');
const {
  Routes
} = require('discord-api-types/v9');

const {
  Client,
  Intents,
  Collection
} = require('discord.js');

const TwitchApi = require("node-twitch").default;

const twitch = new TwitchApi({
  client_id: "yys7ew3f2maus642uhdwvihzudmzz8",
  client_secret: "wzbxl2ej5hparelzldy2bavp8wkk8z"
});

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
  kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
  banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: '{@user}, merci d\'arreter de spammer.', // Message that will be sent in chat upon warning a user.
  kickMessage: '**{user_tag}** à été kick pour spam.', // Message that will be sent in chat upon kicking a user.
  muteMessage: '**{user_tag}** à été mute pour spam.',// Message that will be sent in chat upon muting a user.
  banMessage: '**{user_tag}** à été ban pour spam.', // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
  ignoredPermissions: ['ADMINISTRATOR'], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredMembers: [], // Array of User IDs that get ignored.
  muteRoleName: "🔇・Mute", // Name of the role that will be given to muted users!
  removeMessages: true // If the bot should remove all the spam messages when taking action on a user!
});



const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
  partials: ['CHANNEL']
});

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true
});

TEST_GUILD_ID = "809906388410957824"

client.interactions = new interactions.Client(configbot.token, "923332934814015578")
client.login(configbot.token)

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const commands = [];

client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}


client.once('ready', () => {
  console.log('Ready!');

  /* client.interactions.createCommand({
    name: 'ping',
    description: 'Ping test command'
  }, TEST_GUILD_ID).then(console.log).catch(console.error) */

  const CLIENT_ID = client.user.id;
  const rest = new REST({
    version: '9'
  }).setToken(configbot.token);
  (async () => {
    try {
      if (!TEST_GUILD_ID) {
        await rest.put(
          Routes.applicationCommands(CLIENT_ID), {
          body: commands
        },
        );
        console.log('Successfully registered application commands globally');
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
          body: commands
        },
        );
        console.log('Successfully registered application commands for development guild');
      }
    } catch (error) {
      if (error) console.error(error);
    }
  })();

  setInterval(() => {
    let notif_chann = client.guilds.cache.get('809906388410957824').channels.cache.get('816000634394378303')
    async function getStream() {
      const streams = await twitch.getStreams({ channel: "stexhtv" });
      if (streams.data.length < 1) return
      if (!db.get('streams')) db.set('streams', [])
      if (db.get('streams').some(s => s.started_at === streams.data[0].started_at)) return
      notif_chann.send({
        embeds: [{
          title: "🏆 Titre : **" + streams.data[0].title + "**",
          author: { name: "🎬 " + streams.data[0].user_name + " est en live !" },
          url: "https://www.twitch.tv/stexhtv",
          image: {
            url: streams.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'),
          },
          footer: { text: "Viewers: " + streams.data[0].viewer_count }
        }]
        ,
        content: "<@&814927771327135826>"
      })

      db.push('streams', streams.data[0])

    }

    getStream();
  }, 10000)

  /* const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('roles')
        .setPlaceholder('Sélectionner une raison')
        .addOptions([
          {
            label: 'Invite des membres',
            description: 'Clique ici',
            value: 'firstsout_option',
            emoji: "✉️"
          },
          {
            label: 'Boost le serveur Discord',
            description: 'Clique ici',
            value: 'secondsout_option',
            emoji: "🔮"
          },
          {
            label: 'Change ton status Discord',
            description: 'Clique ici',
            value: 'thirdsout_option',
            emoji: "🔍"
          },

        ]),
    );
  const embed = new MessageEmbed()
    .setAuthor('✨ Soutenir le Discord')
    .setDescription('Tu souhaites soutenir le Discord ? Cool ! \nSélectionne la méthode qui t\'intéresse pour recevoir tous les\n détails!')
  client.guilds.cache.get('809906388410957824').channels.cache.get('924698509322637362').send({ embeds: [embed], components: [row], ephemeral: true }) */
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  antiSpam.message(message)
  if (message.guild === null) {

    if (db.get(message.author.id + "_demand") === null) {
      await db.set(message.author.id + '_demand', { etape: 1, cat: "none", desc: "none", price: "none", title: "none" })
    }

    if (db.get(message.author.id + "_demand.etape") === 1) {
      db.set(message.author.id + "_demand.etape", 2)

      const all = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('fivem')
            .setLabel('FiveM')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('graph')
            .setLabel('Graphisme')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('dev')
            .setLabel('Développement')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('dontclick')
            .setLabel('Ne clique pas')
            .setStyle('DANGER'),
        );


      const embed = new MessageEmbed()
        .setColor('ff7700')
        .setTitle('Salut à toi 🐘,')
        .setDescription(`*Mon maître m'a appris qu'une seule utilité, pour l'instant.*
        Je peux donc poster une demande pour toi, si tu recherches à proposer une offre.
        📚  Dans quelle catégorie aurais - tu souhaité ?`);


      message.author.send({ components: [all], embeds: [embed] }).then(mess => {
        const filter = i => i.message.id === mess.id && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
        collector.on('collect', async i => {
          if (i.user.bot) return

          if (i.customId === 'dev') {
            i.deferUpdate()
            i.message.delete()
            db.set(message.author.id + "_demand.cat", "Développement")

          }
          if (i.customId === 'graph') {
            i.deferUpdate()
            i.message.delete()
            db.set(message.author.id + "_demand.cat", "Graphisme")

          }
          if (i.customId === 'fivem') {
            i.deferUpdate()
            i.message.delete()
            db.set(message.author.id + "_demand.cat", "FiveM")


          }
          /*          if (i.customId === 'map') {
                     db.set(message.author.id + "_demand.cat", "Mappeur")
                     i.deferUpdate()
         
                   } */
          if (i.customId === 'dontclick') {
            db.set(message.author.id + "_demand.etape", 1)
            i.deferUpdate()
            mess.delete()
            const dontclick = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('dontclick2')
                  .setLabel('Ne clique pas')
                  .setStyle('DANGER'),
              );
            return message.author.send({ components: [dontclick], content: "Pourquoi tu as cliqué, je t'avais averti !\n On recommence. Ne clique pas" }).then(mess2 => {
              const filter = i => i.message.id === mess2.id && i.user.id === message.author.id;
              const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 });
              collector.on('collect', async i => {
                if (i.user.bot) return
                if (i.customId === 'dontclick2') {
                  i.deferUpdate()
                  mess2.delete()
                  message.author.send({ content: "Eh voilà, tu es curieux et tu as cliqué.\nTu verras ce qu'il y aura lors de la prochaine mise à jour." })
                }
              })
              collector.on('end', collected => {
                if (db.get(message.author.id, "_demand.cat") == "none") {
                  return db.delete(message.author.id + "_demands")
                }
              });
            })
          } else {
            message.channel.send({
              embeds: [{
                author: { name: "📝 Quel est le titre que ton offre devra porter ?" },
                description: "Entrez le **titre** de votre votre."
              }]
            })
          }


        });


      })
      return
    } else if (db.get(message.author.id + "_demand.etape") === 2) {
      db.set(message.author.id + "_demand.etape", 3)
      db.set(message.author.id + "_demand.title", message.content)
      message.channel.send({
        embeds: [{
          author: { name: "📝 Quelle est la mission ? Que la personne devra faire ?" },
          description: "Decrivez au **maximum** votre mission."
        }]
      })
      return
    } else if (db.get(message.author.id + "_demand.etape") === 3) {
      db.set(message.author.id + "_demand.etape", 4)
      db.set(message.author.id + "_demand.desc", message.content)
      message.channel.send({
        embeds: [{
          author: { name: "💸 Quelle est la rémunération ?" },
          description: "Donner un premier prix pour votre mission."
        }]
      })

      return
    } else if (db.get(message.author.id + "_demand.etape") === 4) {
      db.set(message.author.id + "_demand.price", message.content)
      let chann_demand_dev = client.guilds.cache.get('809906388410957824').channels.cache.get('923209476713119886')
      let chann_demand_graph = client.guilds.cache.get('809906388410957824').channels.cache.get('923213240857657414')
      let chann_demand_fivem = client.guilds.cache.get('809906388410957824').channels.cache.get('925128993227812874')
      //let chann_demand_mappeur = client.guilds.cache.get('809906388410957824').channels.cache.get('923214456190828564')
      let chann;
      if (db.get(message.author.id + "_demand.cat") === "Développement") {
        chann = chann_demand_dev
      }
      if (db.get(message.author.id + "_demand.cat") === "Graphisme") {
        chann = chann_demand_graph
      }
      if (db.get(message.author.id + "_demand.cat") === "FiveM") {
        chann = chann_demand_fivem
      }
      /*      if (db.get(message.author.id + "_demand.cat") === "Mappeur") {
             chann = chann_demand_mappeur
           }
      */
      let mission = db.get(message.author.id + "_demand")
      if (mission.cat == "none" || !chann) {
        db.delete(message.author.id + "_demand")
        return message.author.send('❌ ERREUR: `Veuillez sélectionner la catégorie`')
      }
      message.author.send("🐘 Ta demande a bien été envoyée")
      chann.send({
        embeds: [{
          title: "Nouvelle demande disponible",
          description: "**" + mission.title + "**\n\n📝 **Missions:**\n" + mission.desc + "\n\n💵 **Prix:**\n" + mission.price + ((mission.price.endsWith('€') || mission.price.endsWith('$') ? "" : "€") + "\n\n📌 **Membre:**\n<@" + message.author.id + ">"),
          timestamp: new Date(),
        }]
      })
      let logs_chan = client.guilds.cache.get('809906388410957824').channels.cache.get('925375200533561404')
      logs_chan.send({
        embeds: [{
          title: "Logs demandes",
          description: "**" + mission.title + "**\n\n📝 **Missions:**\n" + mission.desc + "\n\n💵 **Prix:**\n" + mission.price + ((mission.price.endsWith('€') || mission.price.endsWith('$') ? "" : "€") + "\n\n📌 **Membre:**\n<@" + message.author.id + ">"),
          timestamp: new Date(),
        }]
      })

      db.delete(message.author.id + "_demand")
      return
    }

    /* let filter = m => m.author.id === message.author.id
    message.channel.send({
      embeds: [{
        author: { name: "🔍 Que recherchez-vous ?" },
        description: "Entrez `développeur` ou `graphiste`"
      }]
    }).then((q1) => {
      message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(message => {
          message = message.first()
   
          if (message.content == 'développeur') {
            cat = "développeur"
            message.delete()
            q1.delete()
          } else if (message.content == 'graphiste') {
            cat = "graphiste"
            message.delete()
            q1.delete()
          } else {
            message.delete()
            q1.delete()
            message.channel.send("❌ ERREUR : `Réponse invalide`")
          }
        })
    }) */
    return
  }


  let words = ["pute", "con"]
  if (words.some(word => message.content.toLowerCase().includes(word))) {
    message.delete()
    message.channel.send("❌ Veuillez rester courtois.")
  }

  let links = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
  if (links.some(word => message.content.toLowerCase().includes(word))) {
    message.delete()
    message.channel.send("❌ Veuillez ne pas envoyer de pub.")
  }



  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, Math.floor(Math.random() * 9) + 1);
  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);

    if (user.level === 5) {
      message.member.roles.add('924713714433798144')
    } else if (user.level === 10) {
      message.member.roles.add('924713865692991499')
      message.member.roles.remove('924713714433798144')
    } else if (user.level === 15) {
      message.member.roles.add('924713901134852156')
      message.member.roles.remove('924713865692991499')
    } else if (user.level === 30) {
      message.member.roles.add('924713901134852156')
      message.member.roles.remove('924713901134852156')
    }

    message.channel.send({
      embed: {
        title: "`🏆` | Level UP !",
        description: `**Bien joué** ${message.author}, tu viens de passer level **${user.level}**!\n🥳`,
        color: "7188D7",
      }
    })

  }

})

client.on("presenceUpdate", (oldPresence, newPresence) => {
  let role = newPresence.guild.roles.cache.find(c => c.id === "924713242545234000")
  let status = ['https://discord.link/stexlab', 'discord.link/stexlab', '.link/stexlab']
  if (status.includes(newPresence.activities.find(a => a.type === "CUSTOM")?.state)) {
    newPresence.member.roles.add(role)
    newPresence.member.roles.add('923193867057111122')

  } else if (!status.includes(newPresence.activities.find(a => a.type === "CUSTOM")?.state)) {
    newPresence.member.roles.remove(role)
  }
})



client.on('interactionCreate', async interaction => {


  ////////////////////////////////
  ///////////////PASSIONS/////////
  ////////////////////////////////

  if (interaction.isSelectMenu()) {

    let choice = interaction.values[0]
    const member = interaction.member

    if (choice == 'first_option') {
      if (member.roles.cache.some(role => role.id == "923195711061897216")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923195711061897216")
      }
      else {
        member.roles.add("923195711061897216")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }
    else if (choice == 'second_option') {
      if (member.roles.cache.some(role => role.id == "923195622549504050")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923195622549504050")
      }
      else {
        member.roles.add("923195622549504050")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'third_option') {
      if (member.roles.cache.some(role => role.id == "923195821632147496")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923195821632147496")
      }
      else {
        member.roles.add("923195821632147496")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'fourth_option') {
      if (member.roles.cache.some(role => role.id == "923195786186092565")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.interaction.remove("923195786186092565")
      }
      else {
        member.roles.add("923195786186092565")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }


    else if (choice == 'fifth_option') {
      if (member.roles.cache.some(role => role.id == "923195960887234610")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923195960887234610")
      }
      else {
        member.roles.add("923195960887234610")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'six_option') {
      if (member.roles.cache.some(role => role.id == "923196009344028682")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923196009344028682")
      }
      else {
        member.roles.add("923196009344028682")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'seven_option') {
      if (member.roles.cache.some(role => role.id == "923196056555102229")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923196056555102229")
      }
      else {
        member.roles.add("923196056555102229")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'height_option') {
      if (member.roles.cache.some(role => role.id == "923196038175658055")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923196038175658055")
      }
      else {
        member.roles.add("923196038175658055")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'nine_option') {
      if (member.roles.cache.some(role => role.id == "923195751738257458")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923195751738257458")
      }
      else {
        member.roles.add("923195751738257458")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

  }

  //////////////////////////////////
  ///////////DESIGN/////////////////
  //////////////////////////////////

  if (interaction.isSelectMenu()) {

    let choice = interaction.values[0]
    const member = interaction.member

    if (choice == 'firstv_option') {
      if (member.roles.cache.some(role => role.id == "923210750640676904")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923210750640676904")
      }
      else {
        member.roles.add("923210750640676904")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }
    else if (choice == 'secondv_option') {
      if (member.roles.cache.some(role => role.id == "923210907830587442")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923210907830587442")
      }
      else {
        member.roles.add("923210907830587442")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'thirdv_option') {
      if (member.roles.cache.some(role => role.id == "923210936909692938")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923210936909692938")
      }
      else {
        member.roles.add("923210936909692938")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'fourthv_option') {
      if (member.roles.cache.some(role => role.id == "923210959433125898")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        interaction.member.roles.remove("923210959433125898")
      }
      else {
        member.roles.add("923210959433125898")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }


    else if (choice == 'fifthv_option') {
      if (member.roles.cache.some(role => role.id == "923210983751700480")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923210983751700480")
      }
      else {
        member.roles.add("923210983751700480")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'sixv_option') {
      if (member.roles.cache.some(role => role.id == "923211016685379624")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923211016685379624")
      }
      else {
        member.roles.add("923211016685379624")
        member.roles.add("826823980728057876")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }


  }


  /////////////////////////////////
  ///////////////SERVER////////////
  /////////////////////////////////


  if (interaction.isSelectMenu()) {

    let choice = interaction.values[0]
    const member = interaction.member

    if (choice == 'firsts_option') {
      if (member.roles.cache.some(role => role.id == "923192205512957992")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923192205512957992")
      }
      else {
        member.roles.add("923192205512957992")
        member.roles.add("923198433693675530")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }
    else if (choice == 'seconds_option') {
      if (member.roles.cache.some(role => role.id == "923198241212878888")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923198241212878888")
      }
      else {
        member.roles.add("923198241212878888")
        member.roles.add("923198433693675530")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }
  }


  //////////////////////////////////////
  ///////////////////NOTIF//////////////
  //////////////////////////////////////

  if (interaction.isSelectMenu()) {

    let choice = interaction.values[0]
    const member = interaction.member

    if (choice == 'firstn_option') {
      if (member.roles.cache.some(role => role.id == "814927771327135826")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("814927771327135826")
      }
      else {
        member.roles.add("814927771327135826")
        member.roles.add("826823899005321247")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }
    else if (choice == 'secondn_option') {
      if (member.roles.cache.some(role => role.id == "826810694992265227")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("826810694992265227")
      }
      else {
        member.roles.add("826810694992265227")
        member.roles.add("826823899005321247")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'thirdn_option') {
      if (member.roles.cache.some(role => role.id == "834052922069090375")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("834052922069090375")
      }
      else {
        member.roles.add("834052922069090375")
        member.roles.add("826823899005321247")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

    else if (choice == 'fourthn_option') {
      if (member.roles.cache.some(role => role.id == "923195238535807056")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.interaction.remove("923195238535807056")
      }
      else {
        member.roles.add("923195238535807056")
        member.roles.add("826823899005321247")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }


    else if (choice == 'fifthn_option') {
      if (member.roles.cache.some(role => role.id == "923194989033431082")) {
        interaction.reply({ content: "Le rôle vous a été retiré", ephemeral: true })
        member.roles.remove("923194989033431082")
      }
      else {
        member.roles.add("923194989033431082")
        member.roles.add("826823899005321247")
        await interaction.reply({ content: "Le rôle vous a été ajouté", ephemeral: true })
      }
    }

  }

  ////////////////////////////////////
  ////////////SOUTENIR LE DISCORD/////
  ////////////////////////////////////

  if (interaction.isSelectMenu()) {

    let choice = interaction.values[0]

    if (choice == 'firstsout_option') {
      return interaction.reply({
        embeds: [{
          author: { name: "✨ Soutenir le Discord" },
          title: "✉️ Invite des membres ✉️",
          description: `Tu peux inviter tes amis (et même des inconnus) sur le serveur Discord pour nous aider à faire grandir la communauté !

          Pour chaque palier de 10 membres invités, tu gagnes 1 chance en plus durant les giveaways.
          Si tu invites 20 membres, tu as donc 2 chances en plus, 30 membres pour 3 chances en plus, etc !`
        }]
        , ephemeral: true
      })
    }
    else if (choice == 'secondsout_option') {
      return interaction.reply({
        embeds: [{
          author: { name: "✨ Soutenir le Discord" },
          title: "🔮 Boost le serveur Discord 🔮",
          description: `Tu peux obtenir le rôle <@&814854526099128321> si tu boost le serveur Discord !

          __Avantages du rôle :__
          ✅ Plus de chance durant les giveaway
          ✅ Un bonus d'XP pour monter en level plus vite
          ❌ ~~Les 7 chiffres du loto~~
          
          ➜ Après 1 an de boost, tu peux obtenir un rôle spécial !`
        }]
        , ephemeral: true
      })
    }

    else if (choice == 'thirdsout_option') {
      return interaction.reply({
        embeds: [{
          author: { name: "✨ Soutenir le Discord" },
          title: "🔍 Change ton statut Discord 🔍",
          description: `Tu peux obtenir le badge <@&924713242545234000> si ton statut Discord commence par \`discord.link/stexlab\` !

          __Avantages du rôle :__
          ✅ Plus de chance durant les giveaway
          ✅ Un bonus d'XP pour monter en level plus vite
          ❌ ~~On te paie l'essence pendant 1 an~~
          
          ➜ Le bot vérifie les statuts en temps réel.
          ➜ Si tu enlèves le lien de ton status, tu perdras le rôle.`
        }]
        , ephemeral: true
      })
    }


  }

  ////////////////////////////////////
  //////////////TICKET////////////////
  ////////////////////////////////////

  if (interaction.isSelectMenu()) {
    if (interaction.channelId !== "923337890988167218") return
    let choice = await interaction.values[0]
    if (!choice) return
    const member = await interaction.member
    let reason;
    let ticket_reason;

    if (choice == 'firstt_option') {
      reason = "🚧 Ajouter mon projet"
      ticket_reason = "projet"
    }
    else if (choice == 'secondt_option') {
      reason = "📢 Promouvoir mon service/communauté/etc..."
      ticket_reason = "promotion"
    }

    else if (choice == 'thirdt_option') {
      reason = "⚠️ Signaler un membre"
      ticket_reason = "report"
    }

    else if (choice == 'fourtht_option') {
      reason = "🐛 Signaler un problème"
      ticket_reason = "bugs"
    }

    else if (choice == 'fiftht_option') {
      reason = "🦆 Autres"
      ticket_reason = "autres"
    }

    /*     let verif;
        if (!db.get('tickets')) db.set('tickets', [])
        db.get('tickets').forEach(e => {
          if (e.userId === member.id) verif = true
        })
        if (verif) return interaction.reply({ content: "⚠️ Vous avez déjà un ticket ! Fermez le d'abord", ephemeral: true }) */

    let cat = "923337823011110939"
    interaction.member.guild.channels.create(ticket_reason + "-" + interaction.member.user.username, {
      type: 'text',
      parent: cat,
      permissionOverwrites: [
        {
          id: interaction.member.guild.roles.cache.find(r => r.name === '@everyone').id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.member.guild.roles.cache.find(r => r.id === '923199780631478314').id,
          allow: ['VIEW_CHANNEL'],
        },
        {
          id: member.id,
          allow: ['VIEW_CHANNEL']
        }
      ]
    }).then(async (chann) => {

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('close_ticket')
            .setLabel('Fermer')
            .setStyle('DANGER'),
        );
      chann.send({
        embeds: [
          {
            author: { name: "📮 Ticket de " + member.user.tag + "" },
            description: "Raison : " + reason
          }
        ]
        , components: [row]
      })

      db.push("tickets", { userId: member.id, channId: chann.id, messages: [], ticket_reason: ticket_reason })

      await interaction.reply({ content: "Votre ticket a été créé : " + chann.toString(), ephemeral: true })
    })
  }

  if (interaction.isButton()) {
    if (interaction.customId === "close_ticket") {
      let tickets = db.get('tickets')

      if (!interaction.member.roles.cache.some(r => r.id === "923199780631478314")) return interaction.reply({ content: "⚠️ Seulement un membre du staff peut fermer le ticket", ephemeral: true })
      db.get('tickets').forEach(async (e) => {

        if (e.channId === interaction.channelId) {
          channel_close = interaction.member.guild.channels.cache.get(e.channId)

          let messageCollection = new Collection();
          let channelMessages = await channel_close.messages.fetch({
            limit: 100
          }).catch(err => console.log(err));

          messageCollection = messageCollection.concat(channelMessages);

          while (channelMessages.size === 100) {
            let lastMessageId = channelMessages.lastKey();
            channelMessages = await channel_close.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
            if (channelMessages)
              messageCollection = messageCollection.concat(channelMessages);
          }
          let msgs = messageCollection

          let messages = []
          msgs.forEach(element => {
            if (element.content.length > 1) {
              messages.push(element.author.tag + ": " + element.content)
            }
          })
          messages.reverse()
          try {


            const data = messages.join('\n')
            fs.writeFileSync(e.ticket_reason + `-` + interaction.member.guild.members.cache.find(u => u.id === e.userId).id + `.txt`, data);

            channel_logs = interaction.member.guild.channels.cache.get("923338101462544425")

            channel_logs.send({ content: "Ticket : " + e.ticket_reason, files: [e.ticket_reason + `-` + interaction.member.guild.members.cache.find(u => u.id === e.userId).id + `.txt`] }).then(m => {
              fs.unlinkSync(e.ticket_reason + `-` + interaction.member.guild.members.cache.find(u => u.id === e.userId).id + `.txt`)
            })

          } catch (e) { console.log(e) }



        }
      })
      interaction.member.guild.channels.cache.get(interaction.channelId).delete()
    }
  }

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(interaction, client);
    } catch (error) {
      if (error) console.error(error);

      interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }


  return;

});

////////////////////////////////
////////////IMG BIENVENUE//////
////////////////////////////////

client.on("guildMemberAdd", async member => {
  //If not in a guild return
  if (!member.guild) return;
  //create a new Canvas
  const canvas = Canvas.createCanvas(1772, 633);
  //make it "2D"
  const ctx = canvas.getContext('2d');
  //set the Background to the welcome.png
  const background = await Canvas.loadImage(`./welcome.jpg`);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#f2f2f2';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  //set the first text string 
  var textString3 = `${member.user.username}`;
  //if the text is too big then smaller the text
  if (textString3.length >= 14) {
    ctx.font = 'bold 100px Genta';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString3, 720, canvas.height / 2 + 20);
  }
  //else dont do it
  else {
    ctx.font = 'bold 150px Genta';
    ctx.fillStyle = '#f2f2f2';
    ctx.fillText(textString3, 720, canvas.height / 2 + 20);
  }
  //define the Discriminator Tag
  var textString2 = `#${member.user.discriminator}`;
  ctx.font = 'bold 40px Genta';
  ctx.fillStyle = '#f2f2f2';
  ctx.fillText(textString2, 730, canvas.height / 2 + 58);
  //define the Member count
  var textString4 = `Member #${member.guild.memberCount}`;
  ctx.font = 'bold 60px Genta';
  ctx.fillStyle = '#f2f2f2';
  ctx.fillText(textString4, 750, canvas.height / 2 + 125);
  //get the Guild Name
  var textString4 = `${member.guild.name}`;
  ctx.font = 'bold 60px Genta';
  ctx.fillStyle = '#f2f2f2';
  ctx.fillText(textString4, 700, canvas.height / 2 - 150);
  //create a circular "mask"
  ctx.beginPath();
  ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
  ctx.closePath();
  ctx.clip();
  //define the user avatar
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  //draw the avatar
  ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
  //get it as a discord attachment
  const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
  //define the welcome embed
  //define the welcome channel
  const channel = member.guild.channels.cache.find(ch => ch.id === config.CHANNEL_WELCOME);
  //send the welcome embed to there
  channel.send({ files: [attachment], content: "Bienvenue **<@" + member.id + ">** sur le serveur !" })

  //member roles add on welcome every single role
  //let roles = config.ROLES_WELCOME;
  //for (let i = 0; i < roles.length; i++)
  //  member.roles.add(roles[i]);
})

////////////////////////////////
////////////INVITE TRACKER//////
////////////////////////////////

tracker.on('guildMemberAdd', async (member, type, invite) => {
  const welcomeChannel = member.guild.channels.cache.find((ch) => ch.id === "925011602997133373");

  if (type === 'normal' || type === 'vanity') {
    let inviter = member.guild.members.cache.get(invite.inviter.id)
    if (!db.get(invite.inviter.id + ".invites")) db.set(invite.inviter.id + ".invites", [])
    if (db.get(invite.inviter.id + ".invites") && (!db.get(invite.inviter.id + ".invites").includes(member.id))) db.push(invite.inviter.id + ".invites", member.id)
    if (db.get(invite.inviter.id + ".invites").length >= 10) inviter.roles.add('925110390378082365')
    welcomeChannel.send(`Bienvenue ${member}! Il a été invité par \`${invite.inviter.username}\`! (` + db.get(invite.inviter.id + ".invites").length + ` invites)`);

  }

  else if (type === 'unknown') {
    welcomeChannel.send(`Bienvenue ${member}! Je n'arrive pas à savoir comment il a rejoint...`);
  }

});

client.on('guildMemberRemove', member => {
  member.guild.members.cache.forEach(element => {
    let stats = db.get(element.id + "invites");
    if (!db.get(element.id + "invites")) return
    if (db.get(element.id + "invites").includes(member.id)) { stats.splice(stats.indexOf(element, 1)); db.set(element.id + "invites", stats) }
  })
})


