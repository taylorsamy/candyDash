async function initGuild(database, id) {

	//guild table, contains ID, prefix, name

	database.query(`SELECT * 
					FROM information_schema.tables 
					WHERE table_schema = 'candxkxa_candyBot'
						AND table_name = ${id}`,
		function(err, result) {

		if (err) throw err;
		if (!result) {
			database.query(`CREATE TABLE ${id} (
			id INT PRIMARY KEY, 
			prefix VARCHAR(10),
			name VARCHAR(255))`, function(err, result) {
			if (err) throw err;
			});
		}
	});

// TODO add guild to guilds table.

	// TODO figure out how to set up database.
	// TODO table GUILDS needs ID and PREFIX (and some way to link to messages?)
	// TODO MESSAGE table? Needs messageID, channelID, guildID, messageContent, authorID? maybe only for edited/deleted messages?

}