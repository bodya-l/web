/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // NextAuth/Google Photos
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            // Власні домени та CDN
            { protocol: 'https', hostname: 'production.api.restaron.kitg.com.ua' },
            { protocol: 'https', hostname: 'cdn-media.choiceqr.com' },
            { protocol: 'https', hostname: 'cdn-ua.bodo.gift' },
            { protocol: 'https', hostname: 'www.lvivconvention.com.ua' },
            { protocol: 'https', hostname: 'lviv.travel' },
            { protocol: 'https', hostname: 'posteat.ua' },
            
            // Instagram / Meta CDN (використовується для багатьох фото)
            { protocol: 'https', hostname: 'instagram.fiev13-1.fna.fbcdn.net' },
            // Instagram / Meta CDN (загальний)
            { protocol: 'https', hostname: 'scontent-iev1-1.cdninstagram.com' }, 
            
            // Загальні домени (які ви вже мали)
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'www.google.com' },
            { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' }, // Google CDN для мініатюр
            { protocol: 'https', hostname: 'global.cpcdn.com' },
        ],
    },
};

module.exports = nextConfig;