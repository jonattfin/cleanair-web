import axios from 'axios';
const setConfig = (config = {}) => {
  const enhancedConfig = config;

  const cfg = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...enhancedConfig
  };


  return cfg;
};

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  console.error(error);
});

class RestHelper {
  constructor(instance, extraConfig) {
    this.instance = instance;
    this.extraConfig = extraConfig;
  }

  async get(url, config = {}) {
    const response = await this.instance.get(url, setConfig({ ...config, ...this.extraConfig }));
    return response.data;
  }

  //   async put(url, params, config = {}) {
  //     await this.instance.put(url, params, setConfig(config));
  //   }

  //   async post(url, params, config = {}) {
  //     await this.instance.post(url, params, setConfig(config));
  //   }

  //   async patch(url, params, config = {}) {
  //     await this.instance.patch(url, params, setConfig(config));
  //   }

  //   async delete(url, params, config = {}) {
  //     await this.instance.delete(url, params, setConfig(config));
  //   }
}

function getInstance(type) {

  let { url, headers = {} } = {};

  switch (type) {
    case 'api': {
      url = 'http://localhost:8080/api/v1'; // DEV
      // url = 'https://express-api-19.herokuapp.com/api/v1'; // PROD
      break;
    }
    default:
      throw new Error(`The instance of type ${type} is not supported!`);
  }

  const maxContentLength = 1024 * 1024; // 1MB

  return axios.create({
    baseURL: url,
    headers,
    maxContentLength
  });
}

export const ApiService = new RestHelper(getInstance('api'));
