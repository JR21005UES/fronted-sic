import {useAuthStore} from "@/store/auth";

export const useUtils = () => {
  const canNavigate = async (path) => {
    console.log(path, 'path')
    const auth = useAuthStore()

    if(path === '/'){
      return true
    }
    if(!auth.user?.is_admin){
      return false
    }
    return true
  }
  return {
    canNavigate,
  }
}
export default useUtils
