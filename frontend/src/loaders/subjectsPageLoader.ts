import { defer, redirect } from "react-router-dom";
import store from "../globalStore/store";

function subjectsPageLoader({params} : any) {
    const state = store.getState();
    console.log('Got state in subjectsPageLoader:');
    console.log(state);

    let {keys} = params;
    console.log('Got keys in subjectsPageLoader:');
    console.log(keys);

    keys = keys.split(',');
    console.warn('Formatted keys in subjectsPageLoader:');
    console.warn(keys);

    if (!state.authorization.authorized) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    // set default key that corresponds to 'Центральный федеральный округ'
    if (keys.length === 0) {
        console.warn('Got no keys in subjectsPageLoader: manually adding default 2.1. key')
        keys.push('2.1.');
    }
    const worksheetsUrl = new URL(`http://localhost:3002/subjects/`);
    for (let key of keys) {
        worksheetsUrl.searchParams.append('key', key);
    }
    console.log(`Fetching url (subjectsPageLoader) = ${worksheetsUrl}`);

    return defer({
        keys,
        subjectTree: fetch('http://localhost:3002/subjectTree').then(res => res.json() ),
        worksheets: fetch(worksheetsUrl).then(res => res.json() ),
        promise: new Promise((resolve, reject) => {
            setTimeout(() => resolve(5), 2000);
        })
    })
}
export default subjectsPageLoader;