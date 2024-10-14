/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['lh3.googleusercontent.com', 'localhost'], // Your allowed image domains
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'medflow-mena-health.vercel.app', // Your production domain
                port: '', // Leave this empty for default ports (80 for HTTP, 443 for HTTPS)
                pathname: '/**', // This allows all image paths on the domain
            },
        ],
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };
        return config;
    },
};

export default nextConfig;
