import React, { useState } from "react";
import Chart from "../../components/Chart";
import { Button, TreeSelect } from "antd";
import "./ChartsPage.css";
import MessageWrapper from "../../components/MessageWrapper";
import { ChartDataset } from "../../types";

type LineColor = {
  backgroundColor: string;
  borderColor: string;
}

const ChartsPage = () => {
  const [regionsIDs, setRegionsIDs] = useState<string[]>();
  const [subjects, setSubjects] = useState<any>();
  const xlabels = Array.from(Array(101).keys());

  const colors: LineColor[] = [
    {
      backgroundColor: '#8390c7',
      borderColor: '#8390c7'
    },
    {
      backgroundColor: '#bf4b4b',
      borderColor: '#bf4b4b'
    },
    {
      backgroundColor: '#37a166',
      borderColor: '#37a166'
    },
    {
      backgroundColor: '#396d70',
      borderColor: '#396d70'
    },
  ];

  const [totalPopulationPerAge, setTotalPopulationPerAge] = useState<ChartDataset[]>([{data: []}]);
  const [ruralToCityRatioPerAge, setRuralToCityRatioPerAge] = useState<ChartDataset[]>([{data: []}]);
  const [womenToMenRatioPerAge, setWomenToMenRatioPerAge] = useState<ChartDataset[]>([{data: []}]);

  const onRegionsIDsChange = (newValue: string[]) => {
    console.log(newValue);
    setRegionsIDs(newValue);
  };

  const onTreeSubmit = async () => {
    console.log(`Submitting keys = ${regionsIDs}`);

    let populationPerAgeJsons = (regionsIDs as string[]).map(async (id) => 
      (await fetch(`http://localhost:3002/populationPerAge?key=${id}`)).json() 
    );
    let populationPerAgeData = await Promise.all(populationPerAgeJsons);
    populationPerAgeData = populationPerAgeData.map((each, i) => {
      each.backgroundColor = colors[i % colors.length].backgroundColor;
      each.borderColor = colors[i % colors.length].borderColor;
      return each;
    });
    setTotalPopulationPerAge(populationPerAgeData);

    let ruralToCityRatioPerAgeJsons = (regionsIDs as string[]).map(async (id) => 
      (await fetch(`http://localhost:3002/ruralToCityRatioPerAge?key=${id}`)).json() 
    );
    let ruralToCityRatioPerAgeData = await Promise.all(ruralToCityRatioPerAgeJsons);
    ruralToCityRatioPerAgeData = ruralToCityRatioPerAgeData.map((each, i) => {
      each.backgroundColor = colors[i % colors.length].backgroundColor;
      each.borderColor = colors[i % colors.length].borderColor;
      return each;
    });
    setRuralToCityRatioPerAge(ruralToCityRatioPerAgeData);

    let womenToMenRatioPerAgeJsons = (regionsIDs as string[]).map(async (id) => 
      (await fetch(`http://localhost:3002/womenToMenRatioPerAge?key=${id}`)).json() 
    );
    let womenToMenRatioPerAgeData = await Promise.all(womenToMenRatioPerAgeJsons);
    womenToMenRatioPerAgeData = womenToMenRatioPerAgeData.map((each, i) => {
      each.backgroundColor = colors[i % colors.length].backgroundColor;
      each.borderColor = colors[i % colors.length].borderColor;
      return each;
    });
    setWomenToMenRatioPerAge(womenToMenRatioPerAgeData);

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
            datasets={ruralToCityRatioPerAge}
            title="Отношение сельского и городского населений"
          />
        </div>
        <div className="chart">
          <Chart
            type="Bar"
            xlabels={xlabels}
            datasets={womenToMenRatioPerAge}
            title="Отношения числа женщин к числу мужчин"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
