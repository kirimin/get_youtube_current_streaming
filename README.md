# get_youtube_current_streaming
This is a node module that get the latest live streaming's `VideoId` from YouTube Data API.

# How to use
## Add dependencies in your `package.json`

```json
  "dependencies": {
    "get_current_streaming": "https://github.com/kirimin/get_youtube_current_streaming.git#v1.0.0"
  },
```

## Create Google API project and Outh client ID then get credensials
reffer [here](https://developers.google.com/youtube/registering_an_application).


## Require in your code
Like this.

```javascript
const getStreaming = require('get_current_streaming')

const CREDENSIALS = {
    "client_id":"xxxxxxxxxxxxxxxxxx",
    "client_secret":"xxxxxxxxxxxxxxxxxxx",
    "redirect_uris":["xxxxxx"]
}
const CHANNNEL_ID = "UCqN87Ye4TNLB04EFhxJ0L5w"
const LIVE_STATUS = "upcoming" // live status values are "completed", "live", "upcoming"

getStreaming.getVideoId(CREDENSIALS, CHANNNEL_ID, LIVE_STATUS, callback)

function callback(videoId) {
    console.log(videoId)
}
```