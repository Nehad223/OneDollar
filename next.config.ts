/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // ضيف هنا كل الـ hostnames اللي بتحمل منهم الصور
  },
}

module.exports = nextConfig;
