const express = require('express');
const router = express.Router();
const restUtils = require('../Rest/utils.js');
const config = require('../config.json');

// const mainFunctions = require('../app.js');
// const sql = mainFunctions[''];

/* GET home page. */
router.get('/', restUtils.ifLoggedMiddleware, async (req, res) => {

	const userData = await restUtils.fetchUserData(req, res);
	req.session.user = userData.user;


	res.render('home', {
		user: req.session.user,
		checkforperm: restUtils.hasServerManagePerms,
	});
});

router.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/');
	}

	const authURI = 'https://discord.com/api/oauth2/authorize?client_id=517113600184287237&redirect_uri=http%3A%2F%2Fcandybot.xyz%2Foauth2%2Fcallback&response_type=code&scope=identify%20guilds';
	res.render('login', { authURL: authURI, res });
});

router.get('/oauth2/callback', async (req, res) => {
	const authDetails = await restUtils.exchangeAccessToken(config, req, res);
	// console.log('AUTH');
	// console.log(authDetails.body);
	req.session['auth'] = authDetails.body;
	const userData = await restUtils.fetchUserData(req, res);
	// console.log('USER');
	// console.log(userData.user);
	req.session.user = userData.user;
	res.redirect('/');
});

router.get('/me', restUtils.ifLoggedMiddleware, (req, res) => {
	return res.set(200).send({ user: req.session.user, auth: req.session.auth });
});


// router.get('/dashboard/:guildID?', restUtils.ifLoggedMiddleware, async (req, res) => {
// 	const user = req.session.user.guilds.find(i => i.id === req.params.guildID);
// 	if (!user || !restUtils.hasServerManagePerms(req, user.permissions, true)) {
// 		return res.set(401)
// 			.send({ message: 'Forbidden! You don\'t have permissions to edit this server\'s config', status: 401 });
// 	}
// 	const guildData = await r.table('Guilds').get(req.params.guildID);
// 	res.render('Dashboard', {
// 		guildID: req.params.guildID,
// 		guildData: guildData ? guildData : null,
// 	});
// });

module.exports = router;
