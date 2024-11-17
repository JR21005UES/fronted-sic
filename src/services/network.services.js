import axios from 'axios'
import useNoti from "@/composables/useNoti";

const {notify} = useNoti();
let config = {
  baseURL: import.meta.env.VITE_VUE_APP_API_URL || 'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}

const instance = axios.create(config)

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')

  if (token && config.headers !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => {
    if(response.status === 201)
      notify(response.data, 'success')
    return response
  },
  async (error) => {
    let message = ''
    let type = 'error'
    if (error?.response?.status == 0 || error.code == "ERR_NETWORK") {
      message = 'No se pudo establecer conexión con el servidor'
    } else if (error.response.status == 500) {
      message = 'Error de servidor'
    }
      // else if (
      //   error.response.status === 401 &&
      //   localStorage.getItem('refresh_token')
      // ) {
      //   try {
      //     const response = await axios.post('/refresh-token', {
      //       refresh_token: localStorage.getItem('refresh_token'),
      //     })
      //     localStorage.setItem('token', response.data.token)
      //     localStorage.setItem('refresh_token', response.data.refresh_token)
      //
      //     const config = error.config
      //     config.headers['Authorization'] = `Bearer ${response.data.token}`
      //     return axios.request(config)
      //   } catch (error) {
      //     localStorage.removeItem('token')
      //     localStorage.removeItem('refresh_token')
      //     window.location.href = '/login'
      //     return Promise.reject(error)
      //   }
    // }
    else if (error.response.status >= 400 && error.response.status < 500) {
      console.log('error :>> ', error);
      if (error.response.data) {
        message = error.response.data
      }
    } else {
      message = error.response.statusText
    }


    notify(message, type)

    return Promise.resolve(error.message)
  }
)

export default instance
