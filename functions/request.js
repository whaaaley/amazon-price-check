
const https = require('https')

module.exports = function (url, options, body) {
  let data = ''

  function collect (chunk) {
    data += chunk
  }

  return new Promise(function (resolve, reject) {
    const req = https.request(url, options, handler)

    function handler (res) {
      res.on('error', reject)
      res.on('data', collect)
      res.on('end', function () {
        resolve(data)
      })
    }

    req.on('error', reject)
    req.end(body)
  })
}
