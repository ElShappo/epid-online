import {redirect} from 'react-router-dom'
import store from "../globalStore/store";

export default function chartsPageLoader() {
    const state = store.getState();
    console.log('Got state in chartsPageLoader:');
    console.log(state);

    if (!state.authorization.authorized) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    return '';
}