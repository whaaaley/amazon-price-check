
const request = require('../request')

exports.handler = async (event, context) => {
  const sku = event.queryStringParameters.sku
  const res = await request(sku)

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  }
}
