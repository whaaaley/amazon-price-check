
const https = require('https')
const zlib = require('zlib')

const matches = [{
  name: 'mobile',
  open: '<span aria-hidden="true"> · </span>',
  close: '<span aria-hidden="true"> · </span>'
}]

const options = {
  headers: {
    'accept-encoding': 'gzip',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  }
}

module.exports = function (asin) {
  const start = Date.now()
  const url = 'https://www.google.com/search?q=site:amazon.com+' + asin
  let bytes = 0

  return new Promise(function (resolve, reject) {
    const req = https.get(url, options, function (res) {
      const decompress = zlib.createUnzip()

      decompress.on('data', function (chunk) {
        chunk = chunk.toString()

        for (let i = 0; i < matches.length; i++) {
          const { name, open, close } = matches[i]

          const openIndex = chunk.indexOf(open)
          const closeIndex = chunk.indexOf(close, openIndex + 1)

          if (openIndex > -1 && closeIndex > -1) {
            req.abort()

            if (name === 'mobile') {
              const price = chunk.slice(openIndex + open.length, closeIndex)
              const ms = Date.now() - start

              resolve({ bytes, ms, price, asin, url })
            }
          }
        }
      })

      decompress.on('error', function (err) {
        console.log('Error >>', err)
        resolve({ error: 'Failed to decompress a chunk from the request.' })
      })

      res.on('data', function (chunk) {
        bytes += Buffer.byteLength(chunk)
        decompress.write(chunk)
      })

      res.on('end', function () {
        console.log('End >>')
        resolve({ error: 'Failed to find a price for the requested ASIN.' })
      })
    })

    req.on('error', function (err) {
      console.log('Error >>', err)
      resolve({ error: 'Failed to resolve the request.' })
    })
  })
}
