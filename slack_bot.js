let Botkit = require('botkit');
let rasa = require(__dirname + '/rasa_middleware.js')({
	rasa_uri: 'http://localhost:5000',
	project: 'ctraubot',
	model: 'nlu'
});

require("dotenv").config();

let controller = Botkit.slackbot({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  scopes: ['bot'],
  json_file_store: __dirname + '/.db/'
});

controller.middleware.receive.use(rasa.receive);

controller.changeEars(function (patterns, message) {
  return rasa.hears(patterns, message);
});

controller.hears(['greet'],'direct_message', rasa.hears, function(bot, message) {
    bot.reply(message, "Hi! How are you?");  

});

controller.setupWebserver(3000, function (err, webserver) {
  controller
    .createHomepageEndpoint(controller.webserver)
    .createOauthEndpoints(controller.webserver,function(err,req,res) { 
    	console.log(err)
    })
    .createWebhookEndpoints(controller.webserver);
});