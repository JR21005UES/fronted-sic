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

const getEstadoResultadoCierre = async(params= {}) => {
  return network.get('/estadoResulCierre', {params})
} 
const getCierre = async(params= {}) => {
  return network.get('/cierre', {params})
} 
const getBalanceGeneral = async(params= {}) => {
  return network.get('/balanceGen', {params})
} 
const getBalanceGeneralCierre = async(params= {}) => {
  return network.get('/balanceGenCierre', {params})
} 
const crearPartida = async(data) =>
  network.post(`/partida`, data)

const editarPartida = async(id_cuenta, data) =>
  network.put(`/partida/${id_cuenta}`, data)

const editarDato = async(id, data) =>
  network.put(`/dato/${id}`, data)

const deleteDato = async(id) =>
  network.delete(`/dato/${id}`)

const crearDato = async(data) =>
  network.post(`/dato`, data)

export default {
  getLibroDiario,
  getLibroMayor,
  getEstadoResultado,
  getBalanceGeneral,
  crearPartida,
  editarPartida,
  editarDato,
  deleteDato,
  crearDato,
  getEstadoResultadoCierre,
  getBalanceGeneralCierre,
  getCierre,
}
