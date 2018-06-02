const Parse = require('parse');

let ParseCollection;

let user = null;
let doc = null;
let cache = null;

export default class UserAdapter {

    constructor(config) {
        Parse.initialize(config.applicationId, config.javaScriptKey);
        Parse.serverURL = config.url;
        ParseCollection = Parse.Object.extend(config.collection);
    }

    async init() {

    }

    login(login, password) {
        return new Promise((resolve, reject) => {
            Parse.User.logIn(login, password, {
                success: (user) => {
                    resolve(user);
                },
                error: (user, error) => {
                    reject(new Error('Kombination aus Email und Passwort sind falsch.'));
                }
            });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            Parse.User.logOut().then(() => {
                resolve();
            });
        });
    }

    register(payload) {
        return new Promise((resolve, reject) => {
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
        });
    }

    checkAuth() {
        return new Promise((resolve, reject) => {
            user = Parse.User.current();

            if (user) {
                resolve(user);
            } else {
                reject();
            }
        });
    }

    getData(key) {
        return new Promise((resolve, reject) => {
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
        });
    }

    setData(key, value) {
        return new Promise((resolve, reject) => {
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
        });
    }
}
