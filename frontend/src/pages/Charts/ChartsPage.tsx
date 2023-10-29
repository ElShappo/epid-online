import React, { useState } from "react";
import LineChart from "../../components/LineChart";
import { Button, TreeSelect } from "antd";
import "./ChartsPage.css";
import MessageWrapper from "../../components/MessageWrapper";
import { ChartDataset } from "../../types";

const ChartsPage = () => {
  const [regionsIDs, setRegionsIDs] = useState<string[]>();
  const [subjects, setSubjects] = useState<any>();

  const [totalPopulationPerAge, setTotalPopulationPerAge] = useState<ChartDataset[]>([{data: []}]);
  const [ruralToCityPopulationRatioPerAge, setRuralToCityPopulationRatioPerAge] = useState<number[]>();
  const [womenToMenRatioPerAge, setWomenToMenRatioPerAge] = useState<number[]>();

  const onRegionsIDsChange = (newValue: string[]) => {
    console.log(newValue);
    setRegionsIDs(newValue);
  };

  const onTreeSubmit = async () => {
    console.log(`Submitting keys = ${regionsIDs}`);
    let regionsJsons = (regionsIDs as string[]).map(async (id) => (await fetch(`http://localhost:3002/subjectsPopulationsByAges?key=${id}`)).json() );
    let regionsData = await Promise.all(regionsJsons);
    console.error(subjects)
    console.error(regionsData);
    setTotalPopulationPerAge(regionsData);

    // setTotalPopulationPerAge(regionsData.map(region => {
    //     return {
    //       data: region.slice(2, 103)
    //       .reduce((arr: any, row: any) => {
    //         arr.push(row[1]);
    //         return arr;
    //       }, []),
    //       label: 'test'
    //     }
    //   }))
      
  };

  const messageWrapper = <MessageWrapper delay={400} fetchAddress="http://localhost:3002/subjectTree"
    loadingMessageContent="Загружаю список субъектов РФ..." errorMessageContent="Не удалось загрузить субъекты РФ"
    setValue={setSubjects} style={{
        position: "absolute",
        right: "1em",
        top: "10vh",
      }}
   />

  return (
    <div className="charts">
      {messageWrapper}
      <div className="chart">
        <LineChart
          xlabels={Array.from(Array(101).keys())}
          datasets={totalPopulationPerAge}
        />
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          value={regionsIDs}
          dropdownStyle={{ maxWidth: "100%", maxHeight: 400, overflow: "auto" }}
          placeholder="Выберите субъекты РФ"
          allowClear
          multiple
          treeDefaultExpandAll
          onChange={onRegionsIDsChange}
          treeData={subjects}
        />
        <Button type="primary" onClick={onTreeSubmit}>Submit</Button>
      </div>
      <div className="chart">
        <LineChart
          xlabels={[1, 2, 3]}
          datasets={[
            {
              data: [1, 2, 3],
              label: "first",
            },
          ]}
        />
      </div>
      <div className="chart">
        <LineChart
          xlabels={[1, 2, 3]}
          datasets={[
            {
              data: [1, 2, 3],
              label: "first",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ChartsPage;
