import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';


const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.104"],
};

export default withNextIntl(nextConfig);