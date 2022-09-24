const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Rank } = require('canvacord');

const User = require('../Schemas/User.js');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('rank')
      .setDescription("Get your or another member's rank")
      .addUserOption((option) =>
         option
            .setName('member')
            .setDescription('Target @member')
            .setRequired(false)
      ),
   async execute(interaction) {
      const member =
         interaction.options.getMember('member') || interaction.member;

      let user;

      const guildId = member.guild.id;
      const userId = member.user.id;

      user = await User.findOne({ guildId, userId });

      if (!user) {
         user = {
            level: 1,
            xp: 0,
         };
      }

      const rank = new Rank()
         .setAvatar(member.user.displayAvatarURL())
         .setCurrentXP(user.xp)
         .setLevel(user.level)
         .setRank(0, 0, false)
         .setRequiredXP(user.level * 100)
         .setStatus(member.presence.status)
         .setProgressBar('#FFFFFF', 'COLOR')
         .setUsername(member.user.username)
         .setDiscriminator(member.user.discriminator);

      rank.build().then((data) => {
         interaction.reply({
            files: [new AttachmentBuilder(data, { name: 'rank.png' })],
         });
      });
   },
};
