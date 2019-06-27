const Discord = require('discord.js');

const constants = require('../constants.js');
const prefix = constants.prefix;
const client = constants.client;

client.on('message', async(message) => {
    if (!message.author.bot && message.channel.type === "text" && message.content.startsWith(`${prefix}help`)) {

        /* If bot can't write messages */
        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

        /* Gets my avatar URL */
        let DanielVip3 = await client.users.fetch("472831424903380992", true);
        let DanielVip3AvatarURL;
        if (DanielVip3) DanielVip3AvatarURL = await DanielVip3.displayAvatarURL();

        const embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
            .setDescription(
                `
This bot's main purpose is to work as a voice message recorder and send voice messages to make communication between members easy, when they haven't time or possibility to write a lot. \nThere are two interchangeable ways to record a voice message: with \`v!voicemessage\`, in a temporary bot-made voice channel, or with \`v!record\` and \`v!stop\` in already existing voice channels.
\n\n\n
⏺   \`v!voicemessage\` - Creates a voice channel in the first position of the server channel list. When you join this voice channel, the bot will join too and record your voice. When you leave, then, the bot sends your voice message in the channel where you sent this command.
\n\n
--- 🇴🇷 ---
\n\n
⏺   \`v!record\` - Command that goes in combo with \`v!stop\`. When used, in a voice channel, the bot joins it and starts recording your voice. When you want to stop recording, just use \`v!stop\` in the channel where you want the voice message to be sent.\n
⏺   \`v!stop\` - Command that goes in combo with \`v!record\`. When used, after it, stops recording the voice message and sends it in the channel where this command was used.\n
\n\n
If the bot is stuck, you can use\n
⏺   \`v!stuck\` - Command that should un-bug the bot. Please, use it only for emergency situations, like when the bot says that he's recording while he isn't. This command makes the bot leave voice channels, and remove his custom created voice channels.\n
                `)
            .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
            .setFooter("Made by DanielVip3#6167", DanielVip3AvatarURL)
            .setTimestamp();

        /* Sends help in DM and sends "Check DM for help!" in the guild */
        await message.author.send({embed});
        await message.react("✅");
        await message.channel.send("Check DM for help!");
    }
});
