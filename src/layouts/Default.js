
import Panel from 'components/Panel'
import { dispatch } from 'app'

export default (props, children) => state => {
  return (
    <div class='layout-default'>
      <div>
        {children(state, dispatch)}
        {process.env.APP_PROD === false && <Panel/>}
      </div>
    </div>
  )
}
