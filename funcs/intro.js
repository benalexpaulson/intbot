module.exports = async function intro(user, mp3Id) {
  const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');
  const player = createAudioPlayer();
  var listener, voiceChannelId, voiceGuildId;

  if (user.hasOwnProperty('newState')) {
      listener = user.newState.member, oldState = user.oldState;
      if (listener.user.bot || oldState.channelId) { return; }
      voiceChannelId = user.newState.channel.id;
      voiceGuildId = user.newState;
  } else { listener = user;
    voiceChannelId = listener.voice.channelId; 
    voiceGuildId = listener.voice;
  }

 let introId = 18, customUser;

 var roll = Math.floor(Math.random() * 99);
 if (roll < 25 && roll > 5) { introId = 17 }
 if (roll < 35 && roll > 25) { introId = 35 }
 if (roll < 5 && roll > 1) { introId = 13 }
 if (roll === 1) { introId = 11 }

 dbUser.forEach(async function getUser(item, index) {
     if (listener.user.id === item.did) { customUser = item.intro; nick = item.nick } else { return; }
   await customUser
 })

 if (customUser && customUser != 133337) introId = customUser;
 if (customUser == 0) return;
 if (mp3Id) introId = mp3Id+1;

  const connection = joinVoiceChannel({
  channelId: voiceChannelId,
  guildId: voiceGuildId.channel.guild.id,
  adapterCreator: voiceGuildId.channel.guild.voiceAdapterCreator,
 });

  setTimeout(function() {
   const resource = createAudioResource('audio/'+dbMp3[introId-1].mp3);
    // {volume: dbMp3[introId-1].volume}
   player.play(resource);

   const subscription = connection.subscribe(player);

   player.on(AudioPlayerStatus.Idle, () => {
     subscription.unsubscribe();
     connection.destroy();
   });
  }, 10);
}