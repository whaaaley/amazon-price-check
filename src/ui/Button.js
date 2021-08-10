
import cc from 'classcat'

export default (props, children) => {
  const button = cc(['ui-button', props.class])

  return (
    <button class={button} onclick={props.onclick}>
      {children}
    </button>
  )
}
