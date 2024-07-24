import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";

export function middleware(request: NextRequest) {
    console.log("middleware executed");
    const authToken = request.cookies.get(ACCESS_TOKEN)?.value;
    const loggedInUserNotAccessPaths = request.nextUrl.pathname === "/pages/signin" || request.nextUrl.pathname === "/pages/signUp";
    if (loggedInUserNotAccessPaths) {
        if (authToken) {
            return NextResponse.redirect(new URL("/pages/dashboard", request.url));
        } else {
            if (!authToken) {
                return NextResponse.redirect(new URL("/pages/signin", request.url));
            }
        }
    }

    console.log(authToken);
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/pages/landing'],
};
