import {middleware, config as middlewareConfig} from "./middleware";

export default {
    async redirects() {
        return [];
    },
    async headers() {
        return [];
    },
    middleware: {
        matcher: middlewareConfig.matcher,
        handler: middleware,
    },
};
