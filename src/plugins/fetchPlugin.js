export default {
  install(app, options = {}) {
    const baseURL = options.baseURL || '';

    const fetchData = async (url, options = {}) => {
      const response = await fetch(baseURL + url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      
      if (!response.ok) {
        const error = new Error('Failed to fetch');
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    };

    app.config.globalProperties.$fetch = fetchData;

    app.provide('fetch', fetchData);
  }
};