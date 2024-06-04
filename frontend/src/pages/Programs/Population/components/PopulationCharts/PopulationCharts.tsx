import { useEffect, useState } from "react";
import Chart from "../ChartComponent/ChartComponent";
import { TreeSelect } from "antd";
import { observer } from "mobx-react-lite";
import year from "../../../../../store/year";
import { loadingRegionsMessage } from "../../../../../constants";
import Loader from "../../../../../components/Loader/Loader";
import headerHeight from "../../../../../store/headerHeight";
import { PopulationSingleYear } from "../../classes/PopulationSingleYear";

const PopulationCharts = observer(() => {
  console.log(headerHeight);

  const [populationPerRegions, setPopulationPerRegions] = useState<PopulationSingleYear>();
  const [gotRegions, setGotRegions] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>();

  const onChange = (newValue: string[]) => {
    console.log("Old value: ", selectedRegions);
    console.log("New value: ", newValue);
    setSelectedRegions(newValue);
  };

  useEffect(() => {
    async function init() {
      console.log(`useEffect triggered with year = ${year.get()}`);
      const populationSingleYear = new PopulationSingleYear(year.get());
      try {
        await populationSingleYear.setRegions();
        setPopulationPerRegions(populationSingleYear);
        setGotRegions(true);
      } catch (error) {
        console.error("could not load regions");
        console.error(error);
      }
    }
    init();
    return () => {
      setGotRegions(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get()]);

  return gotRegions ? (
    <div className="flex flex-wrap gap-3 w-full max-md:flex-col">
      <div className="flex justify-center w-full px-96 max-xl:px-64 max-lg:px-36 max-sm:px-0">
        <TreeSelect
          showSearch
          value={selectedRegions}
          placeholder="Выберите регионы"
          multiple
          onChange={onChange}
          treeData={[populationPerRegions!.getRegions()!.getAntDesignTreeSelectFormat()]}
          style={{ width: "100%" }}
        />
      </div>
      {selectedRegions && selectedRegions.length ? (
        <div className="w-full flex flex-wrap" style={{ height: `calc(100vh - ${headerHeight.get()}px - 117px)` }}>
          <div className="w-1/3 max-xl:w-full">
            <Chart
              type="Line"
              chartData={populationPerRegions!.getDataForCharts(selectedRegions!, "peoplePerAge")}
              title="Распределение по возрастам"
            />
          </div>
          <div className="w-1/3 max-xl:w-full">
            <Chart
              type="Bar"
              chartData={populationPerRegions!.getDataForCharts(selectedRegions!, "ruralToUrban")}
              title="Отношение сельского и городского населений"
            />
          </div>
          <div className="w-1/3 max-xl:w-full">
            <Chart
              type="Bar"
              chartData={populationPerRegions!.getDataForCharts(selectedRegions!, "womenToMen")}
              title="Отношения числа женщин к числу мужчин"
            />
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <Loader text={loadingRegionsMessage} height={`calc(100vh - ${headerHeight.get()}px - 117px)`} />
  );
});

export default PopulationCharts;
