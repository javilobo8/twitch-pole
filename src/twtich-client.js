const axios = require('axios').default;

const twitchClient = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'client-id': process.env.TWITCH_CLIENT_ID,
  },
});

const HUB_MODE = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
};

function handleTwitchClientError(error) {
  console.log('Error', error.response.data);
  throw error;
}

// https://dev.twitch.tv/docs/api/webhooks-reference/#subscribe-tounsubscribe-from-events
function subscribe(userId) {
  return twitchClient({
    method: 'POST',
    url: '/webhooks/hub',
    data: {
      'hub.callback': process.env.WEBHOOK_CALLBACK,
      'hub.mode': HUB_MODE.SUBSCRIBE,
      // 'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${userId}`,
      'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${userId}`,
      'hub.lease_seconds': process.env.WEBHOOK_LEASE_SECONDS || 0,
      'hub.secret': process.env.WEBHOOK_SECRET,
    },
  }).catch(handleTwitchClientError);
}

function unsubscribe(userId) {
  return twitchClient({
    method: 'POST',
    url: '/webhooks/hub',
    data: {
      'hub.callback': process.env.WEBHOOK_CALLBACK,
      'hub.mode': HUB_MODE.UNSUBSCRIBE,
      'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${userId}`,
    },
  }).catch(handleTwitchClientError);
}

// https://dev.twitch.tv/docs/api/reference/#get-users
async function getUserIds(login) {
  let loginParam = `login=${login}`;

  if (Array.isArray(login)) {
    loginParam = login.map(name => `login=${name}`).join('&');
  }

  const response = await twitchClient({
    method: 'GET',
    url: `/users?${loginParam}`,
  }).catch(handleTwitchClientError);

  return response.data.data.reduce((memo, item) => {
    // eslint-disable-next-line
    memo[item.login] = item.id;
    return memo;
  }, {});
}

exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.getUserIds = getUserIds;
// getUserIds('drdisrespect').then(console.log)