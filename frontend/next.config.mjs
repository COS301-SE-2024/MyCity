/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "build",
    output: "export",

    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    },

    images: {
        unoptimized: true
    }
};

export default nextConfig;
