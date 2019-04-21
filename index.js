require('./read-env');
const axios = require('axios').default;
const channels = require('./channels');

const HUB_MODE = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
};

const twitchClient = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'client-id': process.env.CLIENT_ID,
  },
});

function handleTwitchClientError(error) {
  console.log('Error', error.response.data);
  throw error;
}

// https://dev.twitch.tv/docs/api/webhooks-reference/#subscribe-tounsubscribe-from-events
function subscribe(user_id) {
  return twitchClient({
    method: 'POST',
    url: '/webhooks/hub',
    data: {
      'hub.callback': process.env.WEBHOOK_CALLBACK,
      'hub.mode': HUB_MODE.SUBSCRIBE,
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${user_id}`,
      'hub.lease_seconds': process.env.WEBHOOK_LEASE_SECONDS || 0,
      'hub.secret': process.env.WEBHOOK_SECRET,
    },
  }).catch(handleTwitchClientError);
}

// https://dev.twitch.tv/docs/api/reference/#get-users
async function getUserIds(login) {
  let loginParam = `login=${login}`;

  if (Array.isArray(login)) {
    loginParam = login.map((name) => `login=${name}`).join('&');
  }

  const response = await twitchClient({
    method: 'GET',
    url: `/users?${loginParam}`,
  }).catch(handleTwitchClientError);

  return response.data.data.reduce((memo, item) => {
    memo[item.login] = item.id;
    return memo;
  }, {});
}

(async () => {
  const response = await subscribe(channels.brakal);
})();