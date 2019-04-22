require('dotenv').config();

const { subscribe } = require('./twtich-client');
const app = require('./app');
const tmi = require('./tmi');

function main() {
  tmi.connect();
  const interval = process.env.WEBHOOK_LEASE_SECONDS;

  async function next() {
    await subscribe(process.env.TWITCH_CHANNEL);
    console.log('Subscribed!');
    setTimeout(next, interval * 100000);
  }

  next();
}

main();

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
