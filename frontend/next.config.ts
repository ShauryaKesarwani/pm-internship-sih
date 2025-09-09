/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        domains: ['doc.ux4g.gov.in'],
    },
};

module.exports = nextConfig;
