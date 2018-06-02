import axios from 'axios';

let cache = null;
let user = {};

let BASE_URL = 'http://localhost';
let SESSION = '';

export default class UserAdapter {

    constructor(config) {
        if (config.url) {
            BASE_URL = config.url;
        }
    }

    async init() {
        if (!window.STATMATH_SESSION) {
            throw new Error('No Session Found.');
        }
        
        SESSION = window.STATMATH_SESSION;
        
        this.axios = axios.create({
            baseURL: BASE_URL,
            headers: {
                'OD-SESSION': SESSION,
            },
        });

        let response = await this.axios.get('users/me');

        console.log(response);
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
        if (!cache) {
            let response = await this.axios.get('users/me/data');
            cache = response.data;
        }

        if (cache && cache[key]) {
            return JSON.stringify(cache[key]);
        } else {
            return null;
        }
    }

    async setData(key, value) {
        if (cache == null) cache = {};

        cache[key] = JSON.parse(value);

        let response = await this.axios.post('users/me/data', cache);

        cache = response.data;
    }
}
