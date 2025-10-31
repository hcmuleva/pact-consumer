const axios = require('axios');

class UserServiceClient {
  constructor(baseURL = 'http://localhost:9292') {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getUserById(id) {
    try {
      const response = await this.client.get(`/users/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'User not found',
          status: 404
        };
      }
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }
}

module.exports = UserServiceClient;