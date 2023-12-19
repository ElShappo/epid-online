import { useState } from "react";
import Chart from "../../components/Chart";
import { TreeSelect } from "antd";
import "./ChartsPage.css";
// import MessageWrapper from "../../components/MessageWrapper";
// import { ChartDataset } from "../../types";
import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import { PopulationSingleYear } from "../../utils";
import { observer } from "mobx-react-lite";

const ChartsPage = observer(() => {
  const [regionsIDs, setRegionsIDs] = useState<string[]>();

  const { population }: any = useLoaderData();

  // const [totalPopulationPerAge, setTotalPopulationPerAge] = useState<
  //   ChartDataset[]
  // >([{ data: [] }]);
  // const [ruralToCityRatioPerAge, setRuralToCityRatioPerAge] = useState<
  //   ChartDataset[]
  // >([{ data: [] }]);
  // const [womenToMenRatioPerAge, setWomenToMenRatioPerAge] = useState<
  //   ChartDataset[]
  // >([{ data: [] }]);

  const onRegionsIDsChange = (newValue: string[]) => {
    console.log(newValue);
    setRegionsIDs(newValue);
  };

  // const onTreeSubmit = async () => {
  //   console.log(`Submitting keys = ${regionsIDs}`);
  // };

  return (
    <div className="charts-with-tree">
      <React.Suspense fallback={<div>Загружаю дерево...</div>}>
        <Await
          resolve={population as PopulationSingleYear}
          errorElement={<div>Не удалось загрузить дерево</div>}
        >
          {(resolved: PopulationSingleYear) => {
            return (
              <>
                <div className="tree" style={{ paddingBottom: "1em" }}>
                  <TreeSelect
                    showSearch
                    style={{ width: "50%" }}
                    value={regionsIDs}
                    dropdownStyle={{ maxWidth: "100%", overflow: "auto" }}
                    placeholder="Выберите субъекты РФ"
                    multiple
                    treeDefaultExpandAll
                    onChange={onRegionsIDsChange}
                    treeData={[
                      resolved.getRegions().getAntDesignTreeSelectFormat(),
                    ]}
                  />
                  {/* <Button
                    type="primary"
                    onClick={onTreeSubmit}
                    className="submit-tree"
                  >
                    Подтвердить
                  </Button> */}
                </div>
                {regionsIDs ? (
                  <div className="charts">
                    <div className="chart">
                      <Chart
                        type="Line"
                        chartData={resolved.getDataForCharts(
                          regionsIDs!,
                          "peoplePerAge"
                        )}
                        title="Распределение по возрастам"
                      />
                    </div>
                    <div className="chart">
                      <Chart
                        type="Bar"
                        chartData={resolved.getDataForCharts(
                          regionsIDs!,
                          "ruralToUrban"
                        )}
                        title="Отношение сельского и городского населений"
                      />
                    </div>
                    <div className="chart">
                      <Chart
                        type="Bar"
                        chartData={resolved.getDataForCharts(
                          regionsIDs!,
                          "womenToMen"
                        )}
                        title="Отношения числа женщин к числу мужчин"
                      />
                    </div>
                  </div>
                ) : null}
              </>
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
});

export default ChartsPage;
