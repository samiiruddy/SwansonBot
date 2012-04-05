/*
Copyright (C) 2012 Michael Belardo (http://GPlus.to/TerrorDactylDesigns)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


//variables
//bot and room information - obtain from http://alaingilbert.github.com/Turntable-API/bookmarklet.html
var Bot    = require('ttapi');
var AUTH   = 'auth+live+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //put the auth+live ID here for your bots acct
var USERID = 'xxxxxxxxxxxxxxxxxxxxxxxx'; //put the bots user id here
var ROOMID = 'xxxxxxxxxxxxxxxxxxxxxxxx'; //put your turntable rooms id here
var MASTERID = 'xxxxxxxxxxxxxxxxxxxxxxx'; //put your personal user id here
var MASTERNAME = 'YourUserName'; //put your personal user name here
//for API calls
var http = require('http'); 
// load the bot
var bot = new Bot(AUTH, USERID, ROOMID);
//object to hold user lists
var theUsersList = { };
//silent mode variable in case you want the bot to just be quiet
var shutUp = false;

//functions
//error writer
function errMsg(e) {
  console.log(e);
  bot.speak('Something went wrong...April?! Make it work. I dont care how.')
}

//console messages for viewing room data in the console
bot.on('roomChanged',  function (data) { console.log('Is that Duke Silver?', data); });
bot.on('speak',        function (data) { console.log('Someone has spoken', data); });
bot.on('update_votes', function (data) { console.log('Someone has voted',  data); });
bot.on('registered',   function (data) { console.log('Someone registered', data); });

//user theUsersList code from https://github.com/alaingilbert/Turntable-API/blob/master/examples/users_list.js
bot.on('roomChanged', function (data) {
   // Reset the users list
   theUsersList = { };

   var users = data.users;
   for (var i=0; i<users.length; i++) {
      var user = users[i];
      theUsersList['b' + user.userid] = user;
      console.log('added ' + user + ' to theUsersList');
   }
});

bot.on('registered', function (data) {
   var user = data.user[0];
   theUsersList['b' + user.userid] = user;
});

bot.on('deregistered', function (data) {
   var user = data.user[0];
   delete theUsersList['b' + user.userid];
});
//END of user List section

//arrays for commands
//boo array
var booList = ['Have some dignity.', 'Try again next time, son.', 'I hate this as much as I do my ex-wives, Tammy.'];
//cheer array
var cheerList = ['This is so good I want a steak to commemorate it.', 'Well done, son.', 'I approve.'];

var 
ronList = [
   "Give me all the bacon and eggs you have.",
   "Nature is amazing.",
   "I think I'm going to have that third steak.",
   "Child labor laws are ruining this country.",
   "You had me at meat tornado.",
   "Fishing is like yoga, except I still get to kill something.",
   "Birthdays were invented by Hallmark to sell cards.",
   "Never half ass two things, whole ass one thing.",
   "I have cried twice in my life. Once when I was seven and I was hit by a school bus. And then again when I heard that Li'l Sebastian had passed.",
   "I'm going to type every word I know! Rectangle. America. Megaphone. Monday. Butthole.",
   "I don't want this parks department to build any parks, because I don't believe in government. I think that all government is a waste of taxpayer money.",
   "Thank you all for being here. Let's get started. Sorry, I was talking to these ribs.",
   "Crying is only okay in two places: funerals and the Grand Canyon.",
   "Get me some snakejuice. I hear that stuff is 'tight.'",
   "Skim milk...avoid it.",
   "BOBBY KNIGHT!!!",
   "I know I’m not going to find somebody that’s both aggressively mean and apathetic. April really is the whole package.",
   "Fish meat is practically a vegetable.",
   "Duke Silver? I'm not this 'Duke Silver' you speak of. You're mistaken. Carry on.",
   "When people get a little too chummy with me I like to call them by the wrong name.",
   "Attire: Shorts over 6” are capri pants. Shorts under 6” are European",
   "On my deathbed, my final wish is to have my ex-wives rush to my side so I can use my dying breath to tell them both to go to hell one last time.",
   "I enjoy government functions like I enjoy getting kicked in the nuggets with a steel toed boot",
   "I’m a simple man. I like pretty, dark-haired women and breakfast food",
   "I was born ready. I’m Ron F*%king Swanson."
];



//main room bot actions and features
//Allow boombot to become a psychic medium who can channel your spirit..... AKA.. IM him and he speaks it to the room
bot.on('pmmed', function (data){ 
  if (data.senderid == MASTERID) { 
    try {
      bot.speak(data.text);
    } catch (err) {
      bot.speak(err);
    }
  }
});
//welcome new people
bot.on('registered',  function (data) { 
  if (shutUp == false) {
    if (data.user[0].userid == USERID) { //boombot announces himself
      bot.speak('Ron Swanson, present. Type /Ron for phrases. I could care less.')
    } else if (data.user[0].userid == MASTERID) { //if the master arrives announce him specifically
      bot.speak('Well, my creator '+MASTERNAME+' showed up after all.') 
    } else {
      bot.speak('Welcome to Pawnee, '+data.user[0].name+'! Im Ron. Type /ron to hear some of my trademark quotes.'); //welcome the rest
    }
  }
});



//screw with booted user
bot.on('booted_user', function (data){ bot.speak('What a pity.'); });


//announce new DJ
bot.on('add_dj', function (data) { 
  if (shutUp == false) {
    if (data.user[0].userid == USERID) { 
      //do nothing. or write in something to have him say he has stepped down.
    } else {
      bot.speak('Our own '+data.user[0].name+' has taken the stage, if you do well, expect a call from Jon Ralphio.'); //thanks the dj when they step off stage. note that if this is active the removed dj announcement will never happen.
    }
  }
});

//thanks for DJ'ing
bot.on('rem_dj', function (data) { 
  if (shutUp == false) {
    if (data.user[0].userid == USERID) { 
      //do nothing. 
    } else {
      bot.speak('Everyone give it up for '+data.user[0].name+'! A regular DJ Roomba.'); //thanks the dj when they step off stage. note that if this is active the removed dj announcement will never happen.
    }
  }
}); 

//chat array calls
bot.on('speak', function (data) {
   if (shutUp == false) {
     // Respond to "/hello" command
     if (data.text.match(/^\/hello$/)) {
        bot.speak('Hello. You are '+data.name+' f**king Swanson.');
     }
     // Respond to "/help" command
     if (data.text.match(/^\/help$/)) {
         bot.speak('My current command list is /hello, /help, /boo, /cheer, /swanson, /good, /djmode, /getdown, /speakup, /shutUp.');
     }
     // Respond to "/cheer" command
     if (data.text.match(/^\/cheer$/)) {
     	  var rndm = Math.floor(Math.random() * 3);
          bot.speak(cheerList[rndm]);
     }
     // Respond to "/boo" command
     if (data.text.match(/^\/boo$/)) {
          var rndm = Math.floor(Math.random() * 3);
          bot.speak(booList[rndm]);
     }
 
    
     // Respond to "/ronList" command
     if ((data.text.match(/ron/i))  && (data.userid != USERID)) {
        var rndm = Math.floor(Math.random() * 25);
          bot.speak(ronList[rndm]);
     }
   

//this code was completely written by the BoomBot.js creator and I have no idea how to create this from scratch. Well done, sir.

     // Respond to "/lyrics" command
     if (data.text.match(/^\/lyrics$/)) {
       bot.roomInfo(true, function(data) { 
         //get the current song name and artist, then replace blank spaces with underscores
         var currSong = data.room.metadata.current_song.metadata.song;
         var currArtist = data.room.metadata.current_song.metadata.artist;
         currSong = currSong.replace(/ /g,"_");
         currArtist = currArtist.replace(/ /g,"_");
         currSong = currSong.replace(/\./g,"");
         currArtist = currArtist.replace(/\./g,"");
         //build the api call object
         var options = {
           host: 'lyrics.wikia.com',
           port: 80,
           path: '/api.php?artist=' + currArtist + '&song=' + currSong + '&fmt=json'
         };
         //call the api
         http.get(options, function(res) {
           res.on('data', function(chunk) {  
                try {
                  //lyrics wiki isnt true JSON so JSON.parse chokes
                  var obj = eval("(" + chunk + ')');
                  //give back the lyrics. the api only gives you the first few words due to licensing
                  bot.speak(obj.lyrics);
                  //return the url to the full lyrics
                  bot.speak(obj.url);   
                  console.log(obj);
                } catch (err) {
                  bot.speak(err);
                }
           });
         }).on('error', function(e) {
           bot.speak("Got error: " + e.message);
         });
       });
     }
     // Respond to "/video" command
    if (data.text.match(/^\/video$/)) {
      bot.roomInfo(true, function(data) { 
        var queryResponse = '';
        var currSong = data.room.metadata.current_song.metadata.song;
        var currArtist = data.room.metadata.current_song.metadata.artist;
        currSong = currSong.replace(/ /g,"_");
        currArtist = currArtist.replace(/ /g,"_");
        currSong = currSong.replace(/\./g,"");
        currArtist = currArtist.replace(/\./g,"");
        var options = {
          host: 'gdata.youtube.com',
          port: 80,
          path: "/feeds/api/videos?q=" + currArtist + "_" + currSong + "&max-results=1&v=2&prettyprint=true&alt=json"
        };
        console.log(options);
        http.get(options, function(response) {
          console.log("Got response:" + response.statusCode);
          response.on('data', function(chunk) {  
              try {
                queryResponse += chunk;
              } catch (err) {
                bot.speak(err);
              }
          });
          response.on('end', function(){
            var ret = JSON.parse(queryResponse);
            //if the return is a playlist the JSON is entirely different. For now I am just error handling this.
            try {
              bot.speak(ret.feed.entry[0].media$group.media$content[0].url);
            } catch (err) {
              bot.speak("Sorry. The return was a playlist. This is unsupported currently.");
            }
          });

        }).on('error', function(e) {
          bot.speak("Got error: " + e.message);
        });
      });
    }


//end of stuff I don't understand fully.

  
  }
});
// DJ control
//this next section looks anywhere in the sentence for the word boombot. if it was said by your user id, it will then look for any of the commands and react.
bot.on('speak', function (data) {
  if ((data.text.match(/swansonbot/i)) &&(data.userid == MASTERID)) { 
    //tell SwansonBot to enter silent mode (doesnt announce users or welcome people or respond to commands other than admin commands)
    if (data.text.match(/shutup/i)) {
      shutUp = true;
      bot.speak('I didnt want to talk to you anyway.');
    }
    //let SwansonBot speak again
    if (data.text.match(/speakup/i)) {
      shutUp = false;
      bot.speak('If you insist, though I do prefer silence.')
    }
    //makes SwansonBot get on stage
    if (data.text.match(/djmode/i)) {                   
      bot.speak('Duke Silver about to tear dis house up.');
      bot.addDj();
    }
    //tells SwansonBot to get off stage and get in the crowd
    if (data.text.match(/getdown/i)) {                  
      bot.speak('Is Mouse Rat up next?');
      bot.speak('I have a steak and whiskey waiting at home anyway.')
      bot.remDj();
    }
    //tells SwansonBot to skip the track it is playing
    if (data.text.match(/skip/i)) {                     
      bot.speak('Okay, but only because I want to.');
      bot.skip();
    }
    //You tell 'em, Ron.
    if (data.text.match(/catchphrase/i)) {
      bot.speak('Im Ron F*cking Swanson');
    }
    
   
    
    //adds the current playing song to SwansonBot playlist
    if (data.text.match(/addsong/i)) {
       bot.roomInfo(true, function(data) {
          try {
            var newSong = data.room.metadata.current_song._id;
            var newSongName = songName = data.room.metadata.current_song.metadata.song;
            bot.playlistAdd(newSong);
            bot.speak('Added '+newSongName+' to my Swantastic playlist...April, did I do this right?');
          } catch (err) {
            errMsg(err);
          }
       });
    }
    //The below commands will modify the bots laptop. Set before he takes the stage. This command can be activated while the bot is DJ'ing, however, the laptop icon will not change until he leaves the stage and comes back.
    //set the bots laptop to an iPhone
    if (data.text.match(/phone up/i)) {
      bot.speak('I just got a beeper, you think Ron Swanson owns an iPhone?');
      bot.modifyLaptop('iphone');
    }
    //set the bots laptop to a mac
    if (data.text.match(/fruit up/i)) {
      bot.speak('APRIL!? How do you work this weird computer?');
      bot.modifyLaptop('mac');
    }
    //set the bots laptop to linux
    if (data.text.match(/nix up/i)) {
      bot.speak('Now...This is a mans computer.');
      bot.modifyLaptop('linux');
    }
    //set the bots laptop to chromeOS
    if (data.text.match(/chrome up/i)) {
      bot.speak('I just plain dont like this weird computer.');
      bot.modifyLaptop('chrome');
    }
  }
});



//debug commands
bot.on('speak', function (data) {
   
   // Respond to "/debug" command //for adding test sections //not required
   if ((data.text.match(/^\/debug$/)) && (data.userid == MASTERID)) { 
      try {
        bot.speak('debug reached');
        bot.speak(theUsersList);
      } catch (err) {
        bot.speak(err.toString());
      }
   }

});
// Test stuff
bot.on('speak', function (data) {
   if (data.text.match(/^\/testing$/)) {
      
    try {
    
  }
  catch (err) {
    bot.speak(err.toString());
  }

  
 }

});   



