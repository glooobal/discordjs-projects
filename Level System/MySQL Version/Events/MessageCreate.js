const cooldown = new Set();

module.exports = {
   name: 'messageCreate',
   async execute(message) {
      const guildId = message.guild.id;
      const userId = message.author.id;

      if (message.author.bot || !message.guild) return;
      if (cooldown.has(userId)) return;

      const xpAmount = Math.floor(Math.random() * (25 - 15 + 1) + 15);

      con.query(
         `SELECT * FROM users WHERE userId = '${userId}' AND guildId = '${guildId}'`,
         function (err, rows) {
            if (err) console.log(err);

            if (rows.length < 1)
               sql = `INSERT INTO users (guildId, userId, level, xp) VALUES ('${guildId}', '${userId}', '1', '${xpAmount}')`;

            con.query(
               `UPDATE users SET xp = ${
                  rows[0].xp + xpAmount
               } WHERE userId = '${userId}' AND guildId = '${guildId}'`
            );

            if (rows[0].xp >= rows[0].level * 100) {
               con.query(
                  `UPDATE users SET level = '${
                     rows[0].level + 1
                  }', xp = '0' WHERE userId = '${userId}' AND guildId = '${guildId}'`
               );

               message.reply(
                  `🎉 <@${userId}>, you are now level ${rows[0].level}!`
               );
            }
         }
      );

      cooldown.add(message.author.id);

      setTimeout(() => {
         cooldown.delete(message.author.id);
      }, 60 * 1000);
   },
};
