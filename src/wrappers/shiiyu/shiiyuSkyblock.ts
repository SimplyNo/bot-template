const getAPI = (name) => `https://sky.shiiyu.moe/api/v2/profile/${name}`;
import fetch from 'node-fetch';

export default async function get(name) {
    return new Promise<any>(async res => {
        let data = await fetch(getAPI(name));
        data.json().then(body => {
            body.error && res(0);
            res(body);
        }).catch(e => {
            res(0);
        })
    })
}
