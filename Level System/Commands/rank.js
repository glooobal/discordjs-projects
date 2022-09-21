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
      const member = interaction.options.getMember('member');

      const guildId = interaction.guildId;
      console.log(guildId, member);
      interaction.reply('xd');
      // const userId = member

      // let user;

      // try {
      //    user = await User.findOne({ guildId, userId });
      // } catch (err) {
      //    console.log(err);
      // }
   },
};
