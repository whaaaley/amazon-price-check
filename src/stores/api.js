
/**
 *
 * Utilities
 *
 */

const newState = (data, error, loading, success) =>
  Object.freeze({ data, error, loading, success })

const init = newState(null, null, null, null)
const loading = newState(null, null, true, null)

/**
 *
 * State
 *
 */

export const state = {
  helloWorld: init,
  priceCheck: init
}

/**
 *
 * Internal actions
 *
 */

const setLoading = ({ api }, key) => {
  api[key] = loading
  return { api }
}

// how does netlify deal wtih errors?
// figure that out
const setResponse = ({ api }, { key, data }) => {
  api[key] = data.error
    ? newState(null, data.error, null, false)
    : newState(data, null, null, true)

  return { api }
}

/**
 *
 * Exported actions
 *
 */

export const helloWorld = (state, data) => dispatch => {
  dispatch(setLoading, 'hello-world')

  fetch('/.netlify/functions/hello-world')
    .then(res => res.json())
    .then(data => {
      dispatch(setResponse, { key: 'hello-world', data })
    })
    .catch(error => {
      console.log('Fetch Error', '>>', error.message, error)
    })
}

export const priceCheck = (state, data) => dispatch => {
  dispatch(setLoading, 'priceCheck')

  fetch('/.netlify/functions/price-check?sku=' + state.common.sku)
    .then(res => res.json())
    .then(data => {
      console.log('>>>', data)
      dispatch(setResponse, { key: 'priceCheck', data })
    })
    .catch(error => {
      console.log('Fetch Error', '>>', error.message, error)
    })
}
