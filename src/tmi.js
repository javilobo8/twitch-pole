const tmi = require('tmi.js');

const options = {
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH,
  },
  channels: [],
};

// eslint-disable-next-line
module.exports = new tmi.client(options);
