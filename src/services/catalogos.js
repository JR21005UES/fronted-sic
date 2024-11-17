import network from './network.services'

const getCuentas = async(params= {}) => {
  return network.get('/catalogo', {params})
}

const deleteCuenta = async(id_cuenta) =>
  network.delete(`/catalogo/${id_cuenta}`)

const crearCuenta = async(data) =>
  network.post(`/catalogo`, data)

export default {
  getCuentas,
  deleteCuenta,
  crearCuenta,
}
