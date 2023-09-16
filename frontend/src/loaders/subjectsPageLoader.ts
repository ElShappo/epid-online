import { defer } from "react-router-dom";
function subjectsPageLoader({request} : any) {
    return defer({
        subjects: 'test'
    })
}
export default subjectsPageLoader;