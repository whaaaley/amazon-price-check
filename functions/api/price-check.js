
const googleScrape = require('../google-scrape')
const createHistory = require('../create-history')

exports.handler = async (event, context) => {
  const asin = event.queryStringParameters.asin

  async function ok () {
    const res = await googleScrape(asin)

    if (res.error) {
      throw new Error(res.error)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        priceCheck: res,
        createHistory: await createHistory({ price: res.price, asin })
      })
    }
  }

  try { return ok() } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
