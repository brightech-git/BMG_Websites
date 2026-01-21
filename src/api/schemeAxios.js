import axios from 'axios';


const baseURL ='https://scheme.bmgjewellers.com/api/v1';
export const schemeAxios = axios.create({
    baseURL:baseURL,
    headers:{
        "Content-Type":"application/json",
        "Accept": "application/json",
    }
})