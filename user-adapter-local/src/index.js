export default config => done => {
  const LS_KEY = (config && config.lsKey) ? config.lsKey : 'opendash-user-adapter-local-data';

  let user = {};
  let cache = JSON.parse(localStorage.getItem(LS_KEY)) || {};

  done();

  return {
    login: (user, pass) => (resolve, reject) => {
      resolve(user);
    },

    logout: () => (resolve, reject) => {
      resolve();
    },

    register: (credentials) => (resolve, reject) => {
      resolve(user);
    },

    checkAuth: () => (resolve, reject) => {
      resolve(user);
    },

    getData: (key) => (resolve, reject) => {
      if (cache && cache[key]) {
        resolve(JSON.stringify(cache[key]));
      } else {
        resolve(null);
      }
    },

    setData: (key, value) => (resolve, reject) => {
      cache[key] = JSON.parse(value);
      localStorage.setItem(LS_KEY, JSON.stringify(cache));
      resolve(true);
    },
  }
}