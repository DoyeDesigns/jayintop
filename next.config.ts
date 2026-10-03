import type { NextConfig } from "next";

const firebaseEnvKeys = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
] as const;

const missingFirebaseEnv = firebaseEnvKeys.filter((key) => !process.env[key]);

if (missingFirebaseEnv.length > 0) {
  throw new Error(
    `Missing server-only Firebase environment variables: ${missingFirebaseEnv.join(", ")}. Set them in .env.local. Do not add them to the env block in this file, and do not prefix them with NEXT_PUBLIC_, or Next.js will inline them into the browser bundle.`,
  );
}

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
