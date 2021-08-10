
import cc from 'classcat'

export default (props, children) => {
  const input = cc(['ui-input', props.class])

  return (
    <input
      type='text'
      class={input}
      placeholder={props.placeholder}
      oninput={event => props.oninput(event.target.value)}
    />
  )
}
