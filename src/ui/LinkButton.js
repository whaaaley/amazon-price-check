
/**
 *
 * This component uses logic of ui/link but with the styles of ui/button
 *
 */

import cc from 'classcat'
import { link } from 'pocket/index'

export default (props, content) => {
  const classList = cc([
    'ui-button',
    props.icon ?? '-no-icon',
    props.to === location.pathname && '-active',
    props.class
  ])

  const to = event => {
    event.preventDefault()

    link({
      to: props.to,
      query: props.query
    })
  }

  return <a class={classList} href={props.to} onclick={to}>{content}</a>
}
