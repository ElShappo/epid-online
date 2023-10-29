import React, { useState } from "react";
import Chart from "../../components/Chart";
import { Button, TreeSelect } from "antd";
import "./ChartsPage.css";
import MessageWrapper from "../../components/MessageWrapper";
import { ChartDataset } from "../../types";

const ChartsPage = () => {
  const [regionsIDs, setRegionsIDs] = useState<string[]>();
  const [subjects, setSubjects] = useState<any>();
  const xlabels = Array.from(Array(101).keys());

  const [totalPopulationPerAge, setTotalPopulationPerAge] = useState<ChartDataset[]>([{data: []}]);
  const [ruralToCityPopulationRatioPerAge, setRuralToCityPopulationRatioPerAge] = useState<number[]>();
  const [womenToMenRatioPerAge, setWomenToMenRatioPerAge] = useState<number[]>();

  const onRegionsIDsChange = (newValue: string[]) => {
    console.log(newValue);
    setRegionsIDs(newValue);
  };

  const onTreeSubmit = async () => {
    console.log(`Submitting keys = ${regionsIDs}`);
    let regionsJsons = (regionsIDs as string[]).map(async (id) => 
      (await fetch(`http://localhost:3002/subjectsPopulationsByAges?key=${id}`)).json() 
    );
    let regionsData = await Promise.all(regionsJsons);
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
    <div className="charts-with-tree">
      <div className="charts">
        {messageWrapper}
        <div className="chart">
          <Chart
            type='Line'
            xlabels={xlabels}
            datasets={totalPopulationPerAge}
            title="Распределение по возрастам"
          />
        </div>
        <div className="chart">
          <Chart
            type="Bar"
            xlabels={xlabels}
            datasets={[
              {
                data: [1, 2, 3],
                label: "first",
              },
            ]}
            title="Отношение сельского и городского населений"
          />
        </div>
        <div className="chart">
          <Chart
            type="Bar"
            xlabels={xlabels}
            datasets={[
              {
                data: [1, 2, 3],
                label: "first",
              },
            ]}
            title="Отношения числа женщин к числу мужчин"
          />
        </div>
      </div>
      <div className="tree">
        <TreeSelect
            showSearch
            style={{ width: "50%" }}
            value={regionsIDs}
            dropdownStyle={{ maxWidth: "100%", overflow: "auto" }}
            placeholder="Выберите субъекты РФ"
            multiple
            treeDefaultExpandAll
            onChange={onRegionsIDsChange}
            treeData={subjects}
          />
          <Button type="primary" onClick={onTreeSubmit} className="submit-tree">Submit</Button>
      </div>
    </div>
  );
};

export default ChartsPage;
