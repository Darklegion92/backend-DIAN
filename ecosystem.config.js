module.exports = {
  apps: [
    {
      name: 'dian-backend',
      script: 'dist/main.js',
      instances: 'max', // Utilizar todos los núcleos disponibles
      exec_mode: 'cluster', // Modo cluster para balanceo de carga
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }
  ]
};
