// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // If you use .scss/.sass, Next handles it natively (make sure "sass" is installed)
  // npm i -D sass
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets', 'css')],
  },

  // Allow remote images (adjust if you want stricter domains)
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  webpack: (config) => {
    // keep your absolute import convenience
    config.resolve.modules.push(path.resolve('./'));

    // Fonts (replaces next-fonts/url-loader/file-loader)
    config.module.rules.push({
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: { filename: 'static/fonts/[name][ext]' },
    });

    // OPTIONAL: only if your code imports image files directly and build complains.
    // Next already handles most images, but this mimics "next-images" behavior.
    // config.module.rules.push({
    //   test: /\.(png|jpe?g|gif|svg)$/i,
    //   type: 'asset',
    //   parser: { dataUrlCondition: { maxSize: 8 * 1024 } }, // ~8kb inline
    //   generator: { filename: 'static/images/[name][ext]' },
    // });

    return config;
  },
};

module.exports = nextConfig;
