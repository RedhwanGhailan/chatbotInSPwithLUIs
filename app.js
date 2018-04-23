/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var http = require('http');
var spauth = require('node-sp-auth');
var requestprom = require('request-promise');

// Site and User Creds  
var url = 'set url of sharepoint ';
var username = "set enmail";
var password = "set pw";
//var cog = require('lip/botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '820bf531-46db-4b34-971e-bf1555769f98',
    appPassword: 'bevsjwSDBIW2013}*mUV8}|',
    openIdMetadata: process.env.BotOpenIdMetadata 
    
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// var tableName = 'botdata';
// var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
// var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
  //  console.log("msg recevid");
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});

// bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
//var luisAppId = process.env.LuisAppId;
//var luisAPIKey = process.env.LuisAPIKey;
var luisAPIKey = 'b449f6e53caf4c3d9339ed9f17ba19ec';
var luisAppId = '0b658c91-d8df-4173-8377-f2f8496513b1';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

//const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/0b658c91-d8df-4173-8377-f2f8496513b1?subscription-key=b449f6e53caf4c3d9339ed9f17ba19ec';

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('greeting',
    (session) => {
        session.send('welcome');
        session.endDialog();
    }
).triggerAction({
    matches: 'greeting '
});

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
});

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
});
bot.dialog('GetWeather',
    (session) => {
        session.send('You reached the Weather intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'GetWeather'
});

bot.dialog('Calendar.Add',
    (session) => {
        session.send('You reached the Calendar RG intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Calendar.Add'
});
bot.dialog('develop.chatbot',
    (session) => {
        session.send('I am developed by Redhwan Ghailan');
        session.endDialog();
    }
).triggerAction({
    matches: 'develop.chatbot'
});
bot.dialog('time',
    (session) => {
        session.send(getDateTime());
        session.endDialog();
    }
).triggerAction({
    matches: 'time'
});

bot.dialog('news',
    (session) => {

        spauth.getAuth(url, {
            username: username,
            password: password
        }).then(function (options) {
            // Headers  
            var headers = options.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            // Pull the SharePoint list items  
            requestprom.get({
                url: url + "/_api/web/lists/getByTitle('External News')/items",
                headers: headers,
                json: true
            }).then(function (listresponse) {
                var items = listresponse.d.results;
                var responseJSON = [];
                // process  
                items.forEach(function (item) {
                    if (item.Title != null) {
                        responseJSON.push(item.Title);
                    }
                }, this);
                // Print / Send back the data  
                //  session.send(JSON.stringify(responseJSON));
                console.log("news");
                //session.endDialog();
              console.log(JSON.stringify(responseJSON));
            });
        });
        session.send("pleas waite....");
    }
).triggerAction({
    matches: 'news'
});

//return currnt time
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    return year + ":" + month + ":" + day + ":   " + hour + ":" + min + ":" + sec;

}




//var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/{LUIS APP ID}?subscription-key={LUIS KEY}&verbose=true&timezoneOffset=0&q=");
// POST /knowledgebases/056fee42-4d6c-4b23-a90b-21824abbf76c/generateAnswer
// Host: https://westus.api.cognitive.microsoft.com/qnamaker/v2.0
// Ocp-Apim-Subscription-Key: a0e8b82dd271492eb76af8a6187c1f33
// Content-Type: application/json
// {"question":"hi"}
//bot.recognizer(recognizer);
// var qnaRecognizer = new cog.QnAMakerRecognizer({
//     knowledgeBaseId: '056fee42-4d6c-4b23-a90b-21824abbf76c',
//     subscriptionKey: 'a0e8b82dd271492eb76af8a6187c1f33'
// }); 

// bot.dialog('GetWeather', function(session) {
//     var query = session.message.text;        
//     cog.QnAMakerRecognizer.recognize(query, 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/{056fee42-4d6c-4b23-a90b-21824abbf76c}}/generateAnswer', '{a0e8b82dd271492eb76af8a6187c1f33}', 1, 'intentName', (error, results) => {
//         session.send(results.answers[0].answer)    
//     })    
// }).triggerAction({
//     matches: 'GetWeather'
// });

