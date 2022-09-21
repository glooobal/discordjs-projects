const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Rank } = require('canvacord');

const User = require('../Schemas/User.js');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('rank')
      .setDescription("Get your or another member's rank")
      .addUserOption((option) =>
         option.setName('member').setDescription('Target @member')
      ),
   async execute(interaction) {
      const member =
         interaction.options.getMember('member') || interaction.member;

      const guildId = member.guild.id;
      const userId = member.user.id;

      let user;

      try {
         user = await User.findOne({ guildId, userId });

         let { xp, level } = user;

         const neededAmount = (level) => level * level * 100;

         const rank = new Rank()
            .setAvatar(member.user.displayAvatarURL())
            .setCurrentXP(xp)
            .setRequiredXP(neededAmount(level))
            .setStatus(member.presence.status)
            .setProgressBar('#FFFFFF', 'COLOR')
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator);

         rank.build().then((data) => {
            const attachment = new AttachmentBuilder(data, {
               name: 'rank.png',
            });
            interaction.reply({ files: [attachment] });
         });
      } catch (err) {
         console.log(err);
         interaction.reply({ content: 'Something went wrong, sorry :(' });
      }
   },
};
