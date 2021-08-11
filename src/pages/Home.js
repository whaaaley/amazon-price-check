
import cc from 'classcat'
import { dispatch } from 'app'

import * as api from 'stores/api'
import * as common from 'stores/common'

import Default from 'layouts/Default'

import Button from 'ui/Button'
import Input from 'ui/Input'

/**
 *
 * Event Handlers
 *
 */

const priceCheck = () => {
  dispatch(api.priceCheck)
}

const updateSKU = value => {
  dispatch(common.set, { key: 'sku', value })
}

/**
 *
 * Components
 *
 */

const Table = ({ priceCheck }) => {
  const data = priceCheck.data ?? {}

  const table = priceCheck.loading === null && (
    <table>
      <tr>
        <td>SKU</td>
        <td>{data.sku ?? 'N/A'}</td>
      </tr>
      <tr>
        <td>Price</td>
        <td>{data.price ?? 'N/A'}</td>
      </tr>
      <tr>
        <td>Payload</td>
        <td>{data.bytes ?? 0} bytes</td>
      </tr>
      <tr>
        <td>Time</td>
        <td>{(data.ms ?? 0) / 1000 } ms</td>
      </tr>
    </table>
  )

  const classList = cc([
    'page-home-table',
    priceCheck.loading && '-spinner'
  ])

  return (
    <div class={classList}>{table}</div>
  )
}

/**
 *
 * Main Export
 *
 */

const Home = (state, dispatch) => {
  return (
    <div class='page-home'>
      <div class='page-home-card'>
        <h1>Amazon Price Check</h1>
        <div>
          <div class='page-home-row'>
            <Input placeholder='SKU (example: B0013T5YO4)' oninput={updateSKU}/>
            <Button class='-icon ic-search' onclick={priceCheck}>Check</Button>
          </div>
          <Table priceCheck={state.api.priceCheck}/>
        </div>
      </div>
      <footer>This project is not endorsed by, affiliated with,{'\n'}maintained, authorized, or sponsored by Amazon.com, Inc.</footer>
    </div>
  )
}

export default {
  view: Default({ title: 'Home' }, Home),
  onRoute: () => {
    console.log('Home >> onRoute')
  },
  onBeforeLeave: () => {
    console.log('Home >> onBeforeLeave')
  }
}
