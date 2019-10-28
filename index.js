// Load up the discord.js library
const Discord = require("discord.js");


const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// gotta load those keys
const keys = require("./keys.json")

var keylist = require("./keys.json");

var admins = require("./admins.json")

var whitelist = require("./whitelist.json")

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`with Piranox`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`with Piranox`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`with Piranox`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  


 
  
  if (command === "removekey") {
    var num = message.author.id
    if(admins.hasOwnProperty(num)) {
    var key = args.join(" ")
    var exist = false
    if (keylist.hasOwnProperty(key)) {
      exist = true
      delete keylist[key]
      message.channel.send("Key deleted!")
    }
    if (exist === false) {
      message.channel.send("Key does not exist.")
    }
  }
  }
  if (command === "getkey") {
    var num = message.author.id
    if(message.channel.type === "dm") {
    if (whitelist.hasOwnProperty(num)){
    var id = args.join(" ")
    var got = false

    for (var prop in keylist) {
      if (keylist.hasOwnProperty(prop)) {
        if (keylist[prop] === message.author.id)
        return message.channel.send("You already have a key!")
        if (got === false) {
          if (keylist[prop] === " ") {
            
              keylist[prop] = message.author.id
              for(var index in keylist) { 
                if (keylist[index] === message.author.id){
                message.channel.send("Your key is " +"``"+index+"``")
                got = true
                console.log(index + " claimed by " + message.author.id + " user" + message.author.username)
                }
              }
            }
          }
            
          }
      }
      if (got === false){
        //message.channel.send("It seems like I could not assign you a key, please contact a dev with this error, Error:0")
      }
    }
  }
  }

  if (command === "addkey") {
    var id = message.author.id
    if (message.channel.type === "dm") {
    if (admins.hasOwnProperty(id)){
    var num = message.author.id

    var key = args.join(" ")
    var exist = false

    if (keylist.hasOwnProperty(key)){
      exist = true
      message.channel.send("This key already exists! Please do the command !removekey to remove it.")
    }
    if (exist === false){
      keylist[key] = " "
      message.channel.send("Key " + key + " has been created!")
      console.log("key " + key + " has been added by " + message.author.id + " or user " + message.author.username)
    }
  }
    }
  }



  if (command === "admin") {
    // grant the user whitelist and blacklist permission
    var id = args.join
    var num = message.author.id

    if(admins.hasOwnProperty(num)) {
      admins[id] = true
      message.reply("User granted admin.")
    }
  }

  if (command === "unadmin") {

      var id = args.join
      var num = message.author.id
  
      if(admins.hasOwnProperty(num)) {
        delete admins[id]
        message.reply("Users admin removed.")
        console.log("Admin " + id + " was removed by" + num)
      
    }
  }

  if(command === "whitelist"){
    var num = message.author.id
    var id = args.join(" ")
    if(admins.hasOwnProperty(num)) {
      whitelist[id] = true
      message.channel.send("User " + id + " has been whitelisted!")
      console.log(id + " was whitelisted by " + num + " or user " + message.author.username)
    }
  }

  if (command === "blacklist") {
    var num = message.author.id
    var id = args.join(" ")
    if(admins.hasOwnProperty(num)) {
      whitelist[id] = undefined
      message.channel.send("User " + id + " has been blacklisted!")
      console.log(id + " was blacklisted by " + num + " or user " + message.author.username)
    }
  }

  if (command === "help") {

   

  var fs = require("fs");
  var text = fs.readFileSync("./text.txt", "utf-8");

  message.channel.send(text)




  }

});

client.login(config.token);
