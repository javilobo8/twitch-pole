const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const tmi = require('./tmi');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

const channel = `#${process.env.TWITCH_CHANNEL}`;

async function sendPole() {
  await tmi.join(channel);
  await tmi.say(channel, process.env.TWITCH_MESSAGE);
  await tmi.part(channel);
  console.log('Pole sent!');
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
  console.log(req.body);
  if (req.body.data && Array.isArray(req.body.data) && req.body.data.length) {
    const data = req.body.data[0];
    if (data.type === 'live') {
      sendPole();
    }
  }
  res.send('');
});

module.exports = app;
