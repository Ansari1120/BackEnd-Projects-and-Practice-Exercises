/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "thumbs.dreamstime.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "platform-lookaside.fbsbx.com",
    ], // Add the domain(s) of the external images you want to display.
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    TOKEN: process.env.TOKEN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    MONGO_DB_PROJECT_KEY: process.env.MONGO_DB_PROJECT_KEY,
    MONGO_URI: process.env.MONGO_URI,
    NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    DATABASE_URL: process.env.DATABASE_URL,
    // Other environment variables
  },
};

module.exports = nextConfig;
