export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  FRONTEND_URL: 'http://localhost:3001',
  database: {
    url: '',
  },
  jwt: {
    secret: '',
    expired: '',
  },
  saltOrRounds: 10,
  sengrid: {
    secure_key: '',
  },
});
