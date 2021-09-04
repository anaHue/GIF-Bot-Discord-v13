import { Client, Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({path: './config.env'});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity("Hey ! Launch !info");
});

client.on('channelCreate', (channel) => {
    const newChannel = client.channels.cache.get(channel.id);
    newChannel.send("https://tenor.com/view/welcome-to-my-room-shanna-lisa-marissa-rachel-this-is-my-room-room-showcase-gif-17892777");
})

client.on('messageCreate', async (msg) => {
    if(msg.author.username == "GIF Bot") return;

    const originChannel = client.channels.cache.get(msg.channelId);

    const args = msg.content.split(' ');

    if(args[0] == "!gif"){
        const keywords = args.slice(1, args.length).join(' ');
        const url = `https://g.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_KEY}`;

        const response = await fetch(url);
        const result = await response.json();

        const index = Math.floor(Math.random() * result.results.length);

        const embed = new MessageEmbed();
        embed.setTitle("GIF of " + keywords);
        embed.setDescription(result.results[index].url);
        originChannel.send({embeds: [embed]});
        originChannel.send(result.results[index].url);
    }
    if(args[0] == "!info"){
        originChannel.send(`
            Hi ! I am a bot developed by Anatole ! For the moment, you can use those commands :\n
            ° !info - to get all the informations (but you already knew that)\n
            ° !gif whatever you want - This will select a random GIF based on the keyword(s) you asked for

            I also post a welcome GIF when a new channel is created!

            Anatole and I hope that our work will be useful to you !
        `);
    }
});

client.login(process.env.TOKEN).catch(
    (error) => {
        console.error(error);
    }
);