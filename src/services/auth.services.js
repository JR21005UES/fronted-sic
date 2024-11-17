import network from './network.services'

const login = async(email, password) => {
  const response = await network.post('/login', {email, password})
  return response
}

export default {
  login,
}
