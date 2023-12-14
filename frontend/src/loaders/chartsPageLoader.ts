import {redirect} from 'react-router-dom'
import authorization from '../globalStore/authorization';

export default function chartsPageLoader() {
    console.log('Got state in chartsPageLoader:');
    console.log(authorization);

    if (!authorization.get()) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }
    return '';
}