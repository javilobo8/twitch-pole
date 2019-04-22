require('dotenv').config();

const { subscribe, unsubscribe } = require('./twtich-client');
const app = require('./app');
const tmi = require('./tmi');

function main() {
  const interval = process.env.WEBHOOK_LEASE_SECONDS * 1000;

  tmi.connect();

  async function next() {
    await unsubscribe(process.env.TWITCH_CHANNEL_ID);
    await subscribe(process.env.TWITCH_CHANNEL_ID);
    console.log('Subscribed!');
    setTimeout(next, interval);
  }

  next();
}

main();

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
