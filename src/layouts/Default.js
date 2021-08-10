
import Panel from 'components/Panel'
import { dispatch } from 'app'

export default (props, children) => state => {
  return (
    <div class='layout-default'>
      <div class='layout-default-content'>
        <div>
          {children(state, dispatch)}
        </div>
      </div>
      {process.env.APP_PROD === false && <Panel/>}
    </div>
  )
}
