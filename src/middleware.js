import RPCClient from '@bufferapp/micro-rpc-client'
import { actions, actionTypes } from './'

export default store => {
  let counter = 0
  const rpc = new RPCClient({
    url: '/rpc',
    sendCredentials: 'same-origin',
  })
  return next => action => {
    next(action)
    switch (action.type) {
      case actionTypes.FETCH: {
        const id = counter++ // eslint-disable-line no-plusplus
        const args = action.args || {}

        store.dispatch(
          actions.fetchStart({
            name: action.name,
            args,
            id,
          }),
        )

        rpc
          .call(action.name, args, {
            'x-buffer-client-id': window.xBufferClientId || 'unknown-frontend',
          })
          .then(result =>
            store.dispatch(
              actions.fetchSuccess({
                name: action.name,
                args,
                id,
                result,
              }),
            ),
          )
          .catch(error => {
            console.error(error) // eslint-disable-line
            store.dispatch(
              actions.fetchFail({
                name: action.name,
                args,
                id,
                error: error.message,
              }),
            )
          })
        break
      }
      default:
        break
    }
  }
}
