import { defer, redirect } from "react-router-dom";
import store from "../globalStore/store";

function subjectsPageLoader({request} : any) {
    const state = store.getState();
    if (!state.authorization.authorized) {
        return redirect('/authorization');
    }
    console.log(state);
    return defer({
        subjects: 'test'
    })
}
export default subjectsPageLoader;