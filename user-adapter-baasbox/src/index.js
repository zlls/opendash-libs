import BaasBox from 'baasbox';

let current = null;
let cache = {};

let BassBoxEndPoint;
let BassBoxAppCode;
let BassBoxCollection;

export default class UserAdapter {

    constructor(config) {
        BassBoxEndPoint = config.endpoint;
        BassBoxAppCode = config.appCode;
        BassBoxCollection = config.collection;

        // BaasBox Setup
        BaasBox.setEndPoint(BassBoxEndPoint);
        BaasBox.appcode = BassBoxAppCode;
    }

    init() {
        return new Promise((resolve, reject) => {

        });
    }

    login(user, pass) {
        return new Promise((resolve, reject) => {
            // BaasBox Login:
            BaasBox.login(user, pass)
                .done(response => {
                    resolve(null);
                })
                .fail(error => {
                    reject(new Error('Bad username or password.'));
                });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            BaasBox.logout()
                .done(res => {
                    resolve();
                })
                .fail(error => {
                    reject();
                });
        });
    }

    checkAuth() {
        return new Promise((resolve, reject) => {
            if (current) {
                return resolve(current);
            }

            BaasBox.fetchCurrentUser().then(
                response => {
                    let user = {};
                    user.id = response.data.id;
                    user.name = response.data.user.name;

                    BaasBox.loadCollectionWithParams(BassBoxCollection, { where: "user='" + user.id + "'" }).then(
                        response => {
                            if (response.length > 0) {
                                cache = response[0];
                                current = user;
                                resolve(current);
                            } else {
                                BaasBox.save({ user: user.id }, BassBoxCollection).then(
                                    response => {
                                        cache = response;
                                        current = user;
                                        resolve(current);
                                    },
                                    error => {
                                        reject(null);
                                    }
                                );
                            }
                        },
                        error => {
                            reject(null);
                        }
                    );
                },
                error => {
                    reject(null);
                }
            );
        });
    }

    getData(key) {
        return new Promise((resolve, reject) => {
            // Falls der Key existiert, wird er zurück gegeben.
            if (cache && cache.hasOwnProperty(key)) {
                resolve(JSON.stringify(cache[key]));
            } else {
                reject(null);
            }
        });
    }

    setData(key, value) {
        return new Promise((resolve, reject) => {
            if (cache == null) cache = {};

            cache[key] = JSON.parse(value);

            BaasBox.save(cache, BassBoxCollection).then(
                response => {
                    cache = response;
                    resolve(null);
                },
                err => {
                    reject(null);
                },
            );
        });
    }
}
