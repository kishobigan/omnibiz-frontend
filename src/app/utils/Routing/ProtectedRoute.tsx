'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import api from '@/app/utils/Api/api';
import Cookies from 'js-cookie';
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/app/utils/Constants/constants";
import Loader from "@/app/widgets/loader/loader";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = Cookies.get(ACCESS_TOKEN);
                if (!token) {
                    setIsAuthorized(false);
                    setIsLoading(false);
                    return;
                }

                const decoded: any = jwtDecode(token);
                if (!decoded || typeof decoded.exp !== 'number') {
                    setIsAuthorized(false);
                    setIsLoading(false);
                    return;
                }

                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;
                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.log(error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        const refreshToken = async () => {
            const refreshToken = Cookies.get(REFRESH_TOKEN);
            if (!refreshToken) {
                setIsAuthorized(false);
                return;
            }

            try {
                const res = await api.post('token/refresh', {refresh: refreshToken});
                if (res.status === 200) {
                    Cookies.set(ACCESS_TOKEN, res.data.access, {secure: true, sameSite: 'Strict'});
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.log(error);
                setIsAuthorized(false);
            }
        };

        authenticate();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthorized) {
            router.push('/pages/signin');
        }
    }, [isLoading, isAuthorized, router]);

    useEffect(() => {
        const checkRefreshTokenExpiration = () => {
            const refreshToken = Cookies.get(REFRESH_TOKEN);
            if (!refreshToken) {
                return;
            }

            const decoded: any = jwtDecode(refreshToken);
            if (!decoded || typeof decoded.exp !== 'number') {
                return;
            }

            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
            if (tokenExpiration < now) {
                Cookies.remove(ACCESS_TOKEN);
                Cookies.remove(REFRESH_TOKEN);
                setIsAuthorized(false);
                router.push('/pages/signin');
            }
        };

        const intervalId = setInterval(checkRefreshTokenExpiration, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [router]);

    if (isLoading) {
        return <Loader/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
