export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    url: 'mongodb://localhost:27017',
  },
  jwt: {
    secret: 'secret123',
    expired: '3600',
  },
  saltOrRounds: 10,
});
