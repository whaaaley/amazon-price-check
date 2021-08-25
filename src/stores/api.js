
/**
 *
 * Utilities
 *
 */

function newState (data, error, pending, success) {
  return Object.freeze({
    data,
    error,
    pending,
    success
  })
}

const init = newState(null, null, null, null)
const pending = newState(null, null, true, null)

/**
 *
 * State
 *
 */

export const state = {
  helloWorld: init,
  history: init,
  priceCheck: init
}

/**
 *
 * Internal actions
 *
 */

function setPending ({ api }, key) {
  api[key] = pending
  return { api }
}

function setResponse ({ api }, { key, data, error }) {
  api[key] = error
    ? newState(null, error, null, false)
    : newState(data, null, null, true)

  return { api }
}

/**
 *
 * Internal effects
 *
 */

function request (obj) {
  return async function (dispatch) {
    dispatch(setPending, obj.key)

    async function req () {
      const res = await fetch(obj.url, obj.options)

      console.log(res)

      if (res.status === 200) {
        dispatch(setResponse, { key: obj.key, data: await res.json() })
        return // exit
      }

      dispatch(setResponse, { key: obj.key, error: res.status })
    }

    try { return req() } catch (err) {
      console.log('Request Error >>', err)
    }
  }
}

/**
 *
 * Exported actions
 *
 */

export function helloWorld () {
  return request({
    url: '/.netlify/functions/hello-world',
    key: 'helloWorld'
  })
}

export function priceCheck (state) {
  return request({
    url: '/.netlify/functions/price-check?asin=' + state.common.asin,
    key: 'priceCheck'
  })
}

export function history () {
  return request({
    url: '/.netlify/functions/history',
    key: 'history'
  })
}
