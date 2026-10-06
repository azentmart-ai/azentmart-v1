import axios from "axios";
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"/api",headers:{"Content-Type":"application/json"}});
api.interceptors.request.use(config=>{const token=localStorage.getItem("azentmart_hr_token");if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,error=>{if(error.response?.status===401){localStorage.removeItem("azentmart_hr_token");localStorage.removeItem("azentmart_hr_user");}return Promise.reject(error)});
export default api;
