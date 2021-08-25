
// import cc from 'classcat'
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

const updateASIN = value => {
  dispatch(common.set, { key: 'asin', value })
}

/**
 *
 * Components
 *
 */

const Error = props => {
  // return props.message && <div class='page-home-error'>{props.message}</div>
  return <div class='page-home-error'>Error: There was a problem resolving your request.</div>
}

const Spinner = (props, children) => {
  return props.pending === true
    ? <div class='page-home-spinner'></div>
    : children
}

const Table = props => {
  return (
    <div class='page-home-table'>
      <table>
        {props.body.map(row => <tr>{row.map(data => <td>{data}</td>)}</tr>)}
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
  const data = state.api.priceCheck.data

  const foo = data?.priceCheck
  const tableFOO = [
    ['asin', foo?.asin ?? 'N/A'],
    ['bytes', (foo?.bytes ?? 0) + ' bytes'],
    ['ms', (foo?.ms ?? 0) + ' ms'],
    ['price', foo?.price ?? 'N/A']
  ]

  const bar = data?.createHistory.insert_history_one
  const tableBAR = [
    ['id', bar?.id ?? 'N/A'],
    ['created', bar?.created_at ?? 'N/A'],
    ['price', bar?.price ?? 'N/A'],
    ['asin', bar?.asin ?? 'N/A']
  ]

  return (
    <div class='page-home'>
      <div class='page-home-card'>
        <h1>Amazon Price Check</h1>
        <div>
          <div class='page-home-row'>
            <Input placeholder='ASIN (example: B0013T5YO4)' oninput={updateASIN}/>
            <Button class='-icon ic-search' onclick={priceCheck}>Check</Button>
          </div>
          <Error message={state.api.priceCheck.error}/>
          <Spinner pending={state.api.priceCheck.pending === true}>
            <Table body={tableFOO}/>
            <Table body={tableBAR}/>
          </Spinner>
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
