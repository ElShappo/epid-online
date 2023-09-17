import store from "../globalStore/store";
import { redirect } from "react-router-dom";

export default function pageNotFoundLoader() {
    const state = store.getState();
    if (!state.authorization.authorized) {
        return redirect('/authorization');
    }
    return '';
}