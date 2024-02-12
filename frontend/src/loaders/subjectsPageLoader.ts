import { defer, redirect } from "react-router-dom";
import authorization from "../store/authorization";
import { PopulationSingleYear, Regions } from "../utils";
import year from "../store/year";

function subjectsPageLoader() {
  console.log("Got state in subjectsPageLoader:");
  console.log(authorization);

  if (!authorization.get()) {
    console.warn("User is not authorized: redirecting...");
    return redirect("/authorization");
  }

  console.log(`Current year: ${year.get()}`);
  const regions: Regions = new Regions();

  return defer({
    population: regions
      .setRegions(year.get())
      .then(() => new PopulationSingleYear(year.get(), regions)),
  });
}
export default subjectsPageLoader;
