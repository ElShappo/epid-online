import { defer, redirect } from "react-router-dom";
import store from "../globalStore/store";

function subjectsPageLoader({request} : any) {
    const state = store.getState();
    console.log(state);

    if (!state.authorization.authorized) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    const url = new URL(request.url);
    const keys = url.searchParams.getAll('key');
    
    console.log(url.href);

    const worksheetsUrl = new URL('http://localhost:3002/subjects');
    for (let key of keys) {
        worksheetsUrl.searchParams.append('key', key);
    }

    // set default key that corresponds to 'Центральный федеральный округ'
    if (keys.length === 0) {
        keys.push('2.1.');
    }

    console.log(`Preparing to fetch url = ${worksheetsUrl}`);

    return defer({
        keys,
        subjectTree: fetch('http://localhost:3002/subjectTree').then(res => res.json() ),
        worksheets: fetch(worksheetsUrl).then(res => res.json() ),
        promise: new Promise((resolve, reject) => {
            setTimeout(() => reject(5), 5000);
        })
    })
}
export default subjectsPageLoader;