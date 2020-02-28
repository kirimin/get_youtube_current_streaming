const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = './credentials/';
const TOKEN_PATH = TOKEN_DIR + 'token.json';

exports.getVideoId = (credentials, channelId, liveStatus, callback) => {
  authorize(credentials, channelId, liveStatus, getCurrentStreaming, callback);
}

function authorize(credentials, channelId, liveStatus, authCallback, moduleCallback) {
  var clientId = credentials.client_id;
  var clientSecret = credentials.client_secret;
  var redirectUrl = credentials.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, authCallback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      authCallback(oauth2Client, channelId, liveStatus, moduleCallback);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

function getCurrentStreaming(auth, channelId, liveStatus, callback) {
    let service = google.youtube('v3');
    service.search.list({
        auth: auth,
        part: 'id,snippet',
        channelId: channelId,
        eventType: liveStatus,
        type: 'video',
        order: 'date',
        maxResults: '1'
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        let videos = response.data.items;
        if (videos.length == 0) {
            console.log('No video found.');
            return;
        }
        callback(videos[0].id.videoId);
    });
}