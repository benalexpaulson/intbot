module.exports = async function intro(user, id) {
 const newState = user.newState, oldState = user.oldState;
	if (newState.member.user.bot || oldState.channelId) { console.log("Bot! >>" + newState.member.bot +"--"+oldState.channelId); return; }
 const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus  } = require('@discordjs/voice');
 const player = createAudioPlayer();

 const connection = joinVoiceChannel({
 	channelId: newState.channel.id,
 	guildId: newState.channel.guild.id,
 	adapterCreator: newState.channel.guild.voiceAdapterCreator,
 });

 let introId = 17, customUser;

 dbUser.forEach(async function getUser(item, index) {
     if (newState.member.user.id === item.did) { customUser = item.intro-1; } else { return; }
   await customUser
 })

 if (customUser) introId = customUser;
 if (id) introId = id;

 setTimeout(function() {
  const resource = createAudioResource('audio/'+dbMp3[introId].mp3, {volume: dbMp3[introId].volume});
  player.play(resource);

  const subscription = connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    subscription.unsubscribe();
    connection.destroy();
  });
 }, 10);

}