import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/app/utils/Constants/constants';

const useLogout = () => {
    const router = useRouter();

    const logout = () => {
        console.log("Logout tab clicked")
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        localStorage.removeItem("activeTab");
        router.push('/pages/signin');
    };

    return { logout };
};

export default useLogout;
