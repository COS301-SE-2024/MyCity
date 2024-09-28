import nextPWA from "@ducanh2912/next-pwa";

const withPWA = nextPWA({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swMinify: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts',
                    expiration: {
                        maxEntries: 4,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    },
                },
            },
            {
                urlPattern: /\/api\/.*\/*.json/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    networkTimeoutSeconds: 10,
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 5 * 60, // 5 minutes
                    },
                },
            },
            {
                urlPattern: /\.(?:html|js|css|png|jpg|jpeg|svg|gif)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-resources',
                    expiration: {
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    },
                },
            },
            // Add more caching strategies as needed
        ],
    },
});

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "mycity-storage-bucket.s3.eu-west-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "github.com",
            },
            {
                protocol: "https",
                hostname: "i.imgur.com",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
            },
        ],
    },
    env: {
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
        MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        PLACEKIT_API_KEY: process.env.NEXT_PUBLIC_PLACEKIT_API_KEY,
        API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,

        FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

        NODEAPI_URL: process.env.NEXT_PUBLIC_NODEAPI_URL,
        S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
    },
    webpack(config) {
        // SVG handling configuration
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default withPWA(nextConfig);
