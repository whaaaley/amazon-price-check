
const https = require('https')
const zlib = require('zlib')

// IDs are used to identify the chunk the price is in. They must be unique and
// not match in other scenarios, otherwise you'll encounter false positives
// which will definitely break the script.

const matches = [{
  id: 'priceBlockDealPriceString',
  price: {
    open: '<span class="priceBlockDealPriceString">',
    close: '</span>'
  }
}, {
  id: 'newPitchPriceWrapper_feature_div',
  currency: {
    open: '<span class="a-size-small price-info-superscript" dir="auto">',
    close: '</span>'
  },
  dollars: {
    open: '<span class="price-large">',
    close: '</span>'
  },
  cents: {
    open: '<span class="a-size-small price-info-superscript">',
    close: '</span>'
  }
}]

const options = {
  headers: {
    'Referer': 'https://www.amazon.com/',
    'Upgrade-Insecure-Requests': '1',

    // iPhone 5/SE
    // 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',

    // iPhone X
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  }
}

function yoink (chunk, { open, close }) {
  const startIndex = chunk.indexOf(open)
  const endIndex = chunk.indexOf(close, startIndex)

  return chunk.slice(startIndex + open.length, endIndex).toString().trim()
}

module.exports = function (sku) {
  let bytes = 0
  // const start = performance.now()
  const start = Date.now()
  const url = 'https://www.amazon.com/dp/' + sku

  return new Promise(function (resolve, reject) {
    const req = https.get(url, options, res => {
      const decompress = zlib.createUnzip()

      decompress.on('data', function (chunk) {
        for (let i = 0; i < matches.length; i++) {
          const item = matches[i]

          if (chunk.indexOf(item.id) !== -1) {
            req.abort()

            if (item.id === 'priceBlockDealPriceString') {
              resolve({
                bytes,
                sku,
                url,
                // ms: performance.now() - start,
                ms: Date.now() - start,
                price: yoink(chunk, item.price)
              })

              break // exit loop
            }

            if (item.id === 'newPitchPriceWrapper_feature_div') {
              const currency = yoink(chunk, item.currency)
              const dollar = yoink(chunk, item.dollars)
              const cents = yoink(chunk, item.cents)

              resolve({
                bytes,
                sku,
                url,
                // ms: performance.now() - start,
                ms: Date.now() - start,
                price: `${currency}${dollar}.${cents}`
              })
            }
          }
        }
      })

      decompress.on('error', function (err) {
        console.error(err)
        reject(err)
      })

      res.on('data', chunk => {
        bytes += Buffer.byteLength(chunk)
        decompress.write(chunk)
      })
    })

    req.on('error', error => {
      console.error(error)
      reject(error)
    })
  })
}
