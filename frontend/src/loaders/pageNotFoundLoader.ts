import authorization from '../globalStore/authorization';
import { redirect } from "react-router-dom";

export default function pageNotFoundLoader() {
    if (!authorization.get()) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    return '';
}