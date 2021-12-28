module.exports = {
  apps : [{
    name: 'AuthWas-local',
    script: './ws.js',
    instances: 1,
    autorestart: false,
    watch: false,
    env: {
      PORT:8080,//Express PORT
      NODE_ENV: 'local',
      MONGO_URL: "mongodb://localhost:27017/mooop",
      SECRET_KEY:"cwkimtestkey",
      LOGS:"/svc/dev/bs/was/logs"
    },
  },
  {
    name: 'AuthWas-dev',
    script: './ws.js',
    instances: -1, // 클러스터 모드
    autorestart: false,
    watch: false,
    env: {
      PORT:8081,//Express PORT
      NODE_ENV: 'dev',
      MONGO_URL: "mongodb://localhost:27017/mooop",
      SECRET_KEY:"1235dghchde",
      LOGS:"/svc/app/logs"
    },
  }]
};

