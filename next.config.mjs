/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WEB_SOCKET: process.env.NEXT_PUBLIC_WEB_SOCKET,
    NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
    NEXT_PUBLIC_TYPE: process.env.NEXT_PUBLIC_TYPE,
    NEXT_PUBLIC_project_id: process.env.NEXT_PUBLIC_project_id,
    NEXT_PUBLIC_private_key_id: process.env.NEXT_PUBLIC_private_key_id,
    NEXT_PUBLIC_private_key: process.env.NEXT_PUBLIC_private_key,
    NEXT_PUBLIC_client_email: process.env.NEXT_PUBLIC_client_email,
    NEXT_PUBLIC_client_id: process.env.NEXT_PUBLIC_client_id,
    NEXT_PUBLIC_auth_uri: process.env.NEXT_PUBLIC_auth_uri,
    NEXT_PUBLIC_token_uri: process.env.NEXT_PUBLIC_token_uri,
    NEXT_PUBLIC_auth_provider_x509_cert_url:
      process.env.NEXT_PUBLIC_auth_provider_x509_cert_url,
    NEXT_PUBLIC_client_x509_cert_url:
      process.env.NEXT_PUBLIC_client_x509_cert_url,
    NEXT_PUBLIC_universe_domain: process.env.NEXT_PUBLIC_universe_domain,
  },
};

export default nextConfig;
