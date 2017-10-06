const Parse = require('parse');


export default config => done => {
  
  Parse.initialize(config.applicationId, config.javaScriptKey);
  Parse.serverURL = config.url;
  const ParseCollection = Parse.Object.extend(config.collection);

  let user = null;
  let doc = null;
  let cache = null;

  done();

  return {
    login: (login, password) => (resolve, reject) => {
      Parse.User.logIn(login, password, {
        success: (user) => {
          resolve(user);
        },
        error: (user, error) => {
          reject(new Error('Kombination aus Email und Passwort sind falsch.'));
        }
      });
    },

    logout: () => (resolve, reject) => {
      Parse.User.logOut().then(() => {
        resolve();
      });
    },

    register: (payload) => (resolve, reject) => {
      const user = new Parse.User();

      user.set('username', payload.email);
      user.set('password', payload.password);
      user.set('email', payload.email);

      user.signUp(null, {
        success: (user) => {
          resolve(user);
        },
        error: (user, error) => {
          reject(new Error('Error: ' + error.code + ' ' + error.message));
        }
      });
    },

    checkAuth: () => (resolve, reject) => {
      user = Parse.User.current();

      if (user) {
        resolve(user);
      } else {
        reject();
      }
    },

    getData: (key) => (resolve, reject) => {
      if (cache && cache[key]) {
        return resolve(cache[key]);
      }

      let query = new Parse.Query(ParseCollection);
      query.equalTo('user', user.id);
      query.first({
        success: (result) => {
          if (!result) {
            return reject(null);
          }
          cache = result;
          let config = cache.get('config');
          if (config[key]) {
            resolve(config[key]);
          } else {
            reject(null);
          }
        },
        error: (error) => {
          reject(new Error(`User Adapter Error: ${error.code} ${error.message}`));
        },
      });
    },

    setData: (key, value) => (resolve, reject) => {
      if (cache) {
        let config = cache.get('config');

        config[key] = value;
        cache.set('config', config);
        cache.save(null, {
          success: (result) => {
            cache = result;
            resolve(true);
          },
          error: (error) => {
            reject(new Error(`User Adapter Error: ${error.code} ${error.message}`));
          },
        })
      } else {
        let obj = new ParseCollection();
        let config = {};

        config[key] = value;

        obj.set('user', user.id);
        obj.set('config', config);

        obj.save(null, {
          success: (result) => {
            cache = result;
            resolve(true);
          },
          error: (toSave, error) => {
            reject(new Error(`User Adapter Error: ${error.code} ${error.message}`));
          },
        });
      }
    },
  };
}