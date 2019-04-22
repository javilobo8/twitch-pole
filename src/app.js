const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const tmi = require('./tmi');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

const channel = `#${process.env.TWITCH_CHANNEL}`;

async function sendPole(body) {
  await tmi.join(channel);
  await tmi.say(channel, process.env.TWITCH_MESSAGE);
  await tmi.part(channel);
  console.log('Done!');
}

app.get('/twitch-webhook', (req, res) => {
  console.log(req.query);

  if (req.query['hub.mode'] === 'subscribe') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('');
  }
});

app.post('/twitch-webhook', (req, res) => {
  console.log(req);
  res.send('');
});

module.exports = app;
