import axios from "axios";

// Falls back to same-origin when REACT_APP_API_URL isn't set (e.g. on Vercel)
const API_URL = process.env.REACT_APP_API_URL || "";

export const LOGIN_URL = `${API_URL}/api/auth/login`;
export const REGISTER_URL = `${API_URL}/api/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/api/auth/reset-password`
export const ME_URL = `${API_URL}/api/auth/getuser`;

export function login(email, password,role) {
  return axios.post(LOGIN_URL, { email, password,role });
}

export function register(email, fullname, hostel, password) {
  return axios.post(REGISTER_URL, { email, fullname, hostel, password });
}

export function resetPass(password,params){
  return axios.post(`${RESET_PASSWORD_URL}/${params.role}/${params.userid}/${params.token}`, { password });
}

export function requestPassword(email,role) {
  return axios.post(REQUEST_PASSWORD_URL, { email,role });
}

export function getUserByToken(authToken) {
  return axios.get(ME_URL,{
    headers: {
      "x-access-token": authToken
    }
  });
}
