
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

const PriceCheck = props => {
  const table = props.table

  return (
    <div class='page-home-card'>
      <h1>Amazon Price Check (Beta)</h1>
      <div>
        <Input
          class='-amazon'
          placeholder='SKU (example: B0013T5YO4)'
          oninput={updateSKU}
        />
        <Button class='-amazon' onclick={priceCheck}>Check Price</Button>
      </div>
      <table>
        <tbody>
          <tr>
            <td>Bytes</td>
            <td>{table.bytes ?? 'N/A'}</td>
          </tr>
          <tr>
            <td>SKU</td>
            <td>{table.sku ?? 'N/A'}</td>
          </tr>
          <tr>
            <td>MS</td>
            <td>{table.ms ?? 'N/A'}</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>{table.price ?? 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      <PriceCheck table={state.api.priceCheck.data ?? {}}/>
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
