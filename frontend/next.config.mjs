/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    // output: "export",

    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID

    },

    images: {
        unoptimized: true
    },
    // trailingSlash: true
};

export default nextConfig;
