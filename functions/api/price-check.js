
const googleScrape = require('../google-scrape')
const createHistory = require('../create-history')

exports.handler = async (event, context) => {
  const asin = event.queryStringParameters.asin
  const res = await googleScrape(asin)

  if (res.error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: res.error })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      priceCheck: res,
      createHistory: await createHistory({ price: res.price, asin })
    })
  }
}
