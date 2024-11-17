import network from './network.services'

const getLibroDiario = async(params= {}) => {
  return network.get('/libDiario', {params})
}
export default {
  getLibroDiario,
}
