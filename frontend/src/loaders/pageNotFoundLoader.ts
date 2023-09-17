import store from "../globalStore/store";
import { redirect } from "react-router-dom";

export default function pageNotFoundLoader() {
    const state = store.getState();
    if (!state.authorization.authorized) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    return '';
}