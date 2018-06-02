let LS_KEY;
let cache;

let user = {};

export default class UserAdapter {

    constructor(config) {
        LS_KEY = (config && config.lsKey) ? config.lsKey : 'opendash-user-adapter-local-data';
        cache = JSON.parse(localStorage.getItem(LS_KEY)) || {};
    }

    async init() {

    }

    async login(user, pass) {
        return user;
    }

    async logout() {
        return;
    }

    async register(credentials) {
        return user;
    }

    async checkAuth() {
        return user;
    }

    async getData(key) {
        if (cache && cache[key]) {
            return JSON.stringify(cache[key]);
        } else {
            return null;
        }
    }

    async setData(key, value) {
        cache[key] = JSON.parse(value);
        localStorage.setItem(LS_KEY, JSON.stringify(cache));
        return true;
    }
}
