import network from './network.services'

const getLibroDiario = async(params= {}) => {
  return network.get('/libDiario', {params})
}
const getLibroMayor = async(params= {}) => {
  return network.get('/libMayor', {params})
}
const getEstadoResultado = async(params= {}) => {
  return network.get('/estadoResul/${inv_fin}', {params})
} 
const getBalanceGeneral = async(params= {}) => {
  return network.get('/balanceGen', {params})
} 
const crearPartida = async(data) =>
  network.post(`/partida`, data)

export default {
  getLibroDiario,
  getLibroMayor,
  getEstadoResultado,
  getBalanceGeneral,
  crearPartida,
}
