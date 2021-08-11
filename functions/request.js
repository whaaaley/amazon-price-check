
const https = require('https')
const zlib = require('zlib')

// IDs are used to identify the chunk the price is in. They must be unique and
// not match in other scenarios, otherwise you'll encounter false positives
// which will definitely break the script.

const matches = [{
  name: 'default_price',
  identifier: '<span class="a-size-small price-info-superscript" dir="auto">',
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
}, {
  name: 'deal_price',
  identifier: '<span class="priceBlockDealPriceString">',
  price: {
    open: '<span class="priceBlockDealPriceString">',
    close: '</span>'
  }
}]

// iPhone X User-Agent
const options = {
  headers: {
    'Referer': 'https://www.amazon.com/',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  }
}

function yoink (chunk, { open, close }) {
  const start = chunk.indexOf(open)
  const end = chunk.indexOf(close, start)

  return chunk.slice(start + open.length, end).toString().trim()
}

module.exports = function (sku) {
  let bytes = 0
  const start = Date.now()
  const url = 'https://www.amazon.com/dp/' + sku

  return new Promise(function (resolve, reject) {
    const req = https.get(url, options, function (res) {
      const decompress = zlib.createUnzip()

      decompress.on('data', function (chunk) {
        for (let i = 0; i < matches.length; i++) {
          const item = matches[i]

          if (chunk.indexOf(item.identifier) > -1) {
            req.abort()

            if (item.name === 'deal_price') {
              const ms = Date.now() - start
              const price = yoink(chunk, item.price)

              console.log('deal_price', { bytes, ms, price, sku, url })
              resolve({ bytes, ms, price, sku, url })
            }

            if (item.name === 'default_price') {
              const currency = yoink(chunk, item.currency)
              const dollar = yoink(chunk, item.dollars)
              const cents = yoink(chunk, item.cents)

              const ms = Date.now() - start
              const price = `${currency}${dollar}.${cents}`

              console.log('default_price', { bytes, ms, price, sku, url })
              resolve({ bytes, ms, price, sku, url })
            }
          }
        }
      })

      decompress.on('error', function (err) {
        console.error(err)
        reject(err)
      })

      res.on('data', function (chunk) {
        bytes += Buffer.byteLength(chunk)
        decompress.write(chunk)
      })
    })

    req.on('error', function (err) {
      console.error(err)
      reject(err)
    })
  })
}
