module.exports = {
  apps: [
    {
      name: "mi-node-app-Marco",
      cwd: "./backend",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "3.130.217.150",
      ref: "origin/main",
      repo: "git@github.com:marcojativa85-ctrl/adapractica7.git",
      path: "/home/ubuntu/apps/adapractica7",

      "post-deploy":
        "cd backend && npm install && pm2 startOrReload ../ecosystem.config.js --env production && pm2 save",

      ssh_options: 
		"IdentityFile=/home/marcking/.ssh/PCUPS.pem"
    }
  }
};