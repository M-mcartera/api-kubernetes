export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  FRONTEND_URL: 'http://localhost:3001',
  database: {
    url: 'mongodb://localhost:27017',
  },
  jwt: {
    secret: 'secret123',
    expired: '3600',
  },
  saltOrRounds: 10,
  sengrid: {
    secure_key:
      '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',
  },
});
