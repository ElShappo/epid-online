import { defer, redirect } from "react-router-dom";
import authorization from '../globalStore/authorization';
import { availableYears } from "../constants";
import { Population, Regions } from "../utils";

function subjectsPageLoader({params} : any) {
    console.log('Got state in subjectsPageLoader:');
    console.log(authorization);

    let {year} = params;
    console.log('Got year in subjectsPageLoader:');
    console.log(year);

    if (!authorization.get()) {
        console.warn('User is not authorized: redirecting...');
        return redirect('/authorization');
    }

    if (typeof year === 'string') {
        year = +year
    }

    if (!availableYears.includes(year)) {
        const defaultYear = 2023
        year = defaultYear
        console.log(`Setting default year to ${defaultYear}`)
    }

    const regionsPerYear: Regions[] = []

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _year of availableYears) {
        regionsPerYear.push(new Regions() )
    }

    // const regions = new Regions();

    // (async function() {
    //     await regions.setRegions(year)
    //     console.warn('got regions:')
    //     console.log(await regions.getRegions() )

    //     console.log()
    //     console.warn('tree-like structure: ')
    //     console.log(regions.getAntDesignTreeSelectFormat('1.0.0'))
    //     console.log(regions.getRegionByCode('1.1.0'))
    // })()

    const regionsPromises = regionsPerYear.map((regions, index) => regions.setRegions(availableYears[index]));

    return defer({
        year: year,
        population: Promise.all(regionsPromises).then(() => new Population(regionsPerYear))
        // subjectTree: fetch(`http://localhost:3002/regions?year=${keys}`).then(res => res.json() ),

    })
}
export default subjectsPageLoader;