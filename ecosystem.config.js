module.exports = {
  apps: [
    {
      name: 'start',
      script: './server/index.js',
      args: '-t start',
      env: JSON.stringify({
        COMMON_VARIABLE: 'true'
      }),
      env_production: JSON.stringify({
        NODE_ENV: 'production'
      }),
      watch: [
        'api',
        'config',
        'app',
        'server',
        'k.config.js'
      ],
      ignore_watch: [
        'node_modules'
      ]
    }
  ]
};
