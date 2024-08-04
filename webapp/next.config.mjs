/** @type {import('next').NextConfig} */


const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'interny.s3.sa-east-1.amazonaws.com',
				port: '',
				pathname: '/**/**/*',
			},
		],
	},
};

export default nextConfig;
