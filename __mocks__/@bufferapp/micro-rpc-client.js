const RPCClient = jest.genMockFromModule('@bufferapp/micro-rpc-client')
RPCClient.fakeResult = { fake: 'yes' }
RPCClient.fakeError = 'this is a fake error'
RPCClient.prototype.call = jest.fn(name => {
  if (name === 'create') {
    return Promise.resolve({
      token: 'someSessionToken',
    })
  } else if (name === 'destroy') {
    return Promise.resolve()
  } else if (name === 'fail') {
    return Promise.reject(new Error(RPCClient.fakeError))
  }
  return Promise.resolve(RPCClient.fakeResult)
})
module.exports = RPCClient
