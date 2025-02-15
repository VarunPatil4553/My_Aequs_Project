import axios from "axios";


// Axios API
export const BASE_URL = 'http://localhost:8080'


export const AxiosAPI = axios.create({
    baseURL: BASE_URL,
})