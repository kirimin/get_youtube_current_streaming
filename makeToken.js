const currentStreaming = require('./get_youtube_current_streaming')
const CREDENSIALS = require('./credentials/credensials.js')

currentStreaming.makeNewToken(CREDENSIALS.CREDENSIALS, function(params) {})