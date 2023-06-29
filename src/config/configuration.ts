export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL,
  database: {
    url: process.env.MONGO_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expired: process.env.JWT_EXPIRED,
  },
  saltOrRounds: process.env.SALT_ROUNDS,
  sengrid: {
    secure_key: process.env.SENGRID_SECURE_KEY,
  },
});
