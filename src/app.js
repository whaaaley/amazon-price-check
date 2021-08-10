
import { pocket, router } from '@onclick/pocket/index'
import { patch } from 'superfine'

import * as api from 'stores/api'
import * as common from 'stores/common'
import * as inspector from 'stores/inspector'
import * as panel from 'stores/panel'

import Home from 'pages/Home'

/**
 *
 * Initialize
 *
 */

const node = document.getElementById('app')
const app = foo => router(foo, bar => pocket(bar, view => patch(node, view)))

export const { getState, dispatch } = app({
  state: {
    api: api.state,
    common: common.state,
    inspector: inspector.state,
    panel: panel.state
  },
  middleware: {
    common: () => {
      return {
        onRoute: () => {},
        onBeforeLeave: () => {}
      }
    }
  },
  pages: {
    '/': Home
  }
})

/**
 *
 * Google Tag Manager
 *
 */

// if (process.env.PROD === true) {
//   window.dataLayer = window.dataLayer || []
//   window.dataLayer.push({
//     'gtm.start': Date.now(),
//     'event': 'gtm.js'
//   })
//
//   window.addEventListener('load', () => {
//     const script = document.createElement('script')
//
//     script.id = 'gtm'
//     script.src = 'https://googletagmanager.com/gtm.js?id=GTM-WVH48JK'
//
//     document.body.appendChild(script)
//   })
// }

/**
 *
 * Google AdSense
 *
 */

// if (process.env.PROD === true) {
//   window.addEventListener('load', () => {
//     const script = document.createElement('script')
//
//     script['data-ad-client'] = 'ca-pub-1036438073249007'
//     script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
//
//     document.body.appendChild(script)
//   })
// }
