// getAPI('profiles', 'simplyno')
// getAPI('profile', 'simplyno', 'peach')
const getAPI = (...queries) => `https://api.slothpixel.me/api/skyblock/${encodeURI(queries.join('/'))}`;
import fetch from 'node-fetch';

module.exports = {
    async get(...queries) {
        return new Promise<any>(async res => {
            let data = await fetch(getAPI(...queries));
            data.json().then(body => {
                body.error && res(0);
                res(body);
            }).catch(e => {
                res(0);
            })
        })
    }
}