/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
        MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        PLACEKIT_API_KEY: process.env.NEXT_PUBLIC_PLACEKIT_API_KEY,
        API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
    },

    // images: {
    //     unoptimized: process.env.NODE_ENV != "production" ? true : false,
    //     remotePatterns: [
    //         {
    //             protocol: "https",
    //             hostname: "i.imgur.com",
    //         },
    //     ],
    // },

    webpack(config) {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default nextConfig;
