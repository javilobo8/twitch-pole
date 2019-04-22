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

  Promise.resolve()
    // .then(() => sendPole(req.body))
    .then(() => res.send('Ok!'))
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

module.exports = app;
