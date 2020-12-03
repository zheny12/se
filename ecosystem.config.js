module.exports = {
  apps : [{
    script: 'app.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 link 9166qxyarswhkkw gui41opwrphk7gc &&  pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
