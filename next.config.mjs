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
                hostname: 'fra1.digitaloceanspaces.com', // Add this pattern
                port: '',
                pathname: '/medflow-telegram/**', // Adjust the pathname as needed
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
                // Add custom header for the specific image
                source: '/assets/images/mena_health_logo.jpeg',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
            },
            {
                // Allow cross-origin access for font files
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
                // Allow cross-origin access for audio files
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
        ];
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };

        // Prevent `.ttf` from being treated as a module
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