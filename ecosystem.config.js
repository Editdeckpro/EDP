module.exports = {
  apps: [
    {
      name: 'edit-deck-app',
      cwd: __dirname,
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      // Cluster mode: if one worker hits the session SyntaxError and blocks, the other still serves requests
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
