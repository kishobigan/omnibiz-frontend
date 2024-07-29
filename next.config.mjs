const nextConfig = {
    env: {
        REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    },
    async rewrites() {
        return [
            {
                source: '/@:user_id',
                destination: '/pages/dashboard/:user_id',
            },
        ];
    },
    experimental: {
        optimizeCss: true,
    },
    images: {
        domains: ['res.cloudinary.com'],  // Add this line to allow external domains
    },
};

export default nextConfig;