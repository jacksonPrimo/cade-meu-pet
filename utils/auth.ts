import { decode } from 'jsonwebtoken'

export async function authenticated(){
  const token = await localStorage.getItem('authToken')
  if(!token) return false
  const { exp } = decode(token) as any
  const expired = new Date(exp) > new Date()
  if(expired) {
    logout()
    return false
  } else {
    return true
  }
}

export function logout() {
  localStorage.removeItem('authToken')
}

export function getAuthData(){
  const token = localStorage.getItem('accessToken') || ''
  return decode(token) as { email: string, userId: string }
}