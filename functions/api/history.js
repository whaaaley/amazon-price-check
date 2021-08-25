
const request = require('../request')

const url = 'https://amazon-price-check.hasura.app/api/rest/history'
const options = {
  'method': 'GET',
  'headers': {
    'x-hasura-admin-secret': process.env.ADMIN_SECRET
  }
}

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.parse(await request(url, options))
  }
}
