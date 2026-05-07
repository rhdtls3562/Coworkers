import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: {
            all: [{ not: 'foreign' }, { query: /[?&]url(?=&|$)/ }],
          },
          type: 'asset',
        },
        {
          condition: {
            all: [{ not: 'foreign' }, { not: { query: /[?&]url(?=&|$)/ } }],
          },
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                dimensions: false,
              },
            },
          ],
          as: '*.js',
        },
      ],
    },
  },
  webpack(config) {
    // @ts-expect-error - webpack rule 타입이 NextConfig에 정의되어 있지 않음
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
            },
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  /* TODO: 게시글 목업 데이터 없어지면 삭제 */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
