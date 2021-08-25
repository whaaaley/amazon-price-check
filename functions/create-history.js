
const request = require('./request')

const url = 'https://amazon-price-check.hasura.app/api/rest/create-history'
const options = {
  'method': 'POST',
  'headers': {
    'content-type': 'application/json',
    'x-hasura-admin-secret': process.env.ADMIN_SECRET
  }
}

module.exports = function (body) {
  return request(url, options, JSON.stringify(body))
    .then(data => JSON.parse(data))
    .catch(error => {
      console.log(error)
    })
}
