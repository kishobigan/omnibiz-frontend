import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '@/app/utils/Constants/constants';
import api from "@/app/utils/Api/api";

const useLogout = () => {
    const router = useRouter();
    const logout = async () => {
        try {
            const refreshToken = Cookies.get(REFRESH_TOKEN);
            const token = Cookies.get(ACCESS_TOKEN);
            const response = await api.post('auth/logout', {
                refresh_token: refreshToken,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.status === 205) {
                Cookies.remove(ACCESS_TOKEN);
                Cookies.remove(REFRESH_TOKEN);
                localStorage.removeItem("activeTab");
                router.push('/pages/signin');
            }
        } catch (error: any) {
            console.error('Error during logout:', error);
        }
    };
    return {logout};
};

export default useLogout;