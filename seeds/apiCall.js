const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzQ5NTY5ZWU5NTkyMzdkNDc4MzYxNCIsImlhdCI6MTU5MDIzODQ3NywiZXhwIjoxNTk4MDE0NDc3fQ.5PcR2XzpovHeQb6zbH5MfiRJWgO6eZw9ny3Eny3-Tig`;
instance.interceptors.request.use(
  async config => {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },

  err => {
    return Promise.reject(err);
  }
);
module.exports = instance;
