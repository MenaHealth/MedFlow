/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            'lh3.googleusercontent.com',
            'localhost',
            'medflow-telegram.fra1.digitaloceanspaces.com',
            'fra1.digitaloceanspaces.com',
            'medflow-telegram.fra1.cdn.digitaloceanspaces.com',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'medflow-telegram.fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'medflow-telegram.fra1.cdn.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/medflow-telegram/**',
            },
            {
                protocol: 'https',
                hostname: 'medflow-mena-health.vercel.app',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/assets/images/mena_health_logo.jpeg',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
            },
            {
                source: '/:path*.(ttf|woff|woff2|eot|otf)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
            {
                source: '/:path*.ogg',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
            {
                source: '/api/telegram-bot/get-media',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
        ];
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };

        config.module.rules.push({
            test: /\.ttf$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/_next/static/chunks',
                        outputPath: 'static/fonts',
                        name: '[name].[hash].[ext]',
                        emitFile: false,
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;