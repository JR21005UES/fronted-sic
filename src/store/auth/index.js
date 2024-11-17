import { defineStore} from "pinia";
import authServices from '@/services/auth.services'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: 1,
      email: 'admin@admin.com',
      name: 'Admin',
      is_admin: false,
    },
  }),
  actions: {
    async login(email, password){
      const response = await authServices.login(email, password)
      if(response.status === 200){
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refreshToken)
        router.push('/')
      }
    },
    logout(){
      console.log('logout')
      localStorage.removeItem('token')
      router.push('/login')
    },
  }
})
