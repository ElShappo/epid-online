import { defer, redirect } from "react-router-dom";
import authorization from "../store/authorization";
import { PopulationSingleYear, Regions } from "../utils";
import year from "../store/year";

export default function chartsPageLoader() {
  console.log("Got state in chartsPageLoader:");
  console.log(authorization);

  if (!authorization.get()) {
    console.warn("User is not authorized: redirecting...");
    return redirect("/authorization");
  }
  console.log(`Current year: ${year.get()}`);
  const regions: Regions = new Regions();

  return defer({
    population: regions.setRegions(year.get()).then(() => {
      const result = new PopulationSingleYear(year.get(), regions);
      console.log("hey there!");
      console.log(result);
      return result;
    }),
  });
}
