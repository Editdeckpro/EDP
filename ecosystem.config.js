module.exports = {
  apps: [
    {
      name: 'edit-deck-app',
      cwd: __dirname,
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      // Use 1 instance to avoid session/cookie issues with NextAuth; scale via nginx/load balancer if needed
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      // Next.js loads .env from cwd when running `next start`; ensure .env has NEXTAUTH_URL and NEXTAUTH_SECRET
    },
  ],
};
