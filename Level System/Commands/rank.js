const { SlashCommandBuilder } = require('discord.js');

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

         interaction.reply({
            content: `<@${userId}>, your current rank is ${level} with ${xp}xp.`,
         });
      } catch (err) {
         console.log(err);
         interaction.reply({ content: 'Something went wrong, sorry :(' });
      }
   },
};
