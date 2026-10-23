module.exports = { 
  apps : [{ 
    name: "mi-node-app", 
    script: "./index.js", 
    instances: "max",       // Modo Cluster: usa todos los núcleos de la CPU 
    exec_mode: "cluster", 
 
    // Producción: Variables de entorno protegidas 
    env: { 
      NODE_ENV: "production", 
      PORT: 3000, 
      DB_HOST: "mongodb+srv://mjativab1_db_user:pXe4XSYgoCPbqc9U@cluster0.vwz14mx.mongodb.net/", 
      DB_USER: "mjativab1_db_user", 
      DB_PASS: "pXe4XSYgoCPbqc9U" 
    }, 
    // Logs y Monitoreo del Servidor 
    error_file: "/var/www/tu-app/logs/err.log", 
    out_file: "/var/www/tu-app/logs/out.log", 
    log_date_format: "YYYY-MM-DD HH:mm:ss Z", 
    merge_logs: true 
  }], 
 
  // Automatización del Despliegue desde tu PC local 
  deploy : { 
    production : { 
      user : 'ubuntu', 
      host : '3.130.217.150', 
      ref  : 'origin/main', 
      repo : 'git@github.com:marcojativa85-ctrl/adapractica7.git', 
      path : '/var/www/tu-app', 
      'post-deploy' : 'mkdir -p logs && npm install && pm2 reload ecosystem.config.js --env production 
&& pm2 save', 
      ssh_options: "IdentityFile=~/.ssh/tu-llave-aws.pem" // Ruta a tu llave .pem local 
    } 
  } 
}; 

