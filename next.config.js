/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Unterdrücken der punycode-Warnung
  webpack: (config, { isServer }) => {
    // Ignoriere die punycode-Warnung
    config.ignoreWarnings = [
      { message: /The `punycode` module is deprecated/ }
    ];
    
    return config;
  },
};

module.exports = nextConfig; 