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
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8000/api/:path*',
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*'
            }
        ];
    },
    experimental: {
        optimizeCss: true,
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
};

export default nextConfig;