
module.exports = {
    apps: [
      {
        name: "App Edit deck",
        exec_mode: 'cluster',
        script: './node_modules/next/dist/bin/next',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "400M",
        // Give Next.js time to shut down gracefully (e.g. in-flight requests, signOut)
        kill_timeout: 15000,
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };


  // module.exports = {
  //   apps: [
  //     {
  //       name: 'Accounting',
  //       exec_mode: 'cluster',
  //       instances: 'max', // Or a number of instances
  //       script: './node_modules/next/dist/bin/next',
  //       args: 'start',
  //       exp_backoff_restart_delay: 100, // optional, adjust as needed
  //       watch: true, // optional, adjust as needed
  //       max_memory_restart: '400M' // optional, adjust as needed
  //     }
  //   ]
  // }
