/**
 * FIRST CREATE NEW TABLE IN YOUR DATABASE
 * `CREATE TABLE users (guildId varchar(50), userId varchar(50), level int, xp int)`
 */

const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Rank } = require('canvacord');

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

      const guildId = member.guild.id;
      const userId = member.user.id;

      con.query(
         `SELECT * FROM users WHERE userId = '${userId}' AND guildId = '${guildId}'`,
         function (err, rows) {
            if (err) console.log(err);

            if (rows.length < 1)
               sql = `INSERT INTO users (guildId, userId, level, xp) VALUES ('${guildId}', '${userId}', '1', '${xpAmount}')`;

            const rank = new Rank()
               .setAvatar(member.user.displayAvatarURL())
               .setCurrentXP(rows[0].xp)
               .setLevel(rows[0].level)
               .setRank(0, 0, false)
               .setRequiredXP(rows[0].level * 100)
               .setStatus(member.presence.status)
               .setProgressBar('#FFFFFF', 'COLOR')
               .setUsername(member.user.username)
               .setDiscriminator(member.user.discriminator);

            rank.build().then((data) => {
               interaction.reply({
                  files: [new AttachmentBuilder(data, { name: 'rank.png' })],
               });
            });
         }
      );
   },
};
