'use client';
import axios from "axios"
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import {router} from "next/client";
import {useRouter} from 'next/navigation';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = Cookies.get(ACCESS_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            const router = useRouter();
            if (error.response && error.response.status === 401) {
                router.push('/pages/signin');
            }
        }
        return Promise.reject(error);
    }
);

export default api