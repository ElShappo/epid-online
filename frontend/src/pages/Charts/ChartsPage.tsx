import React, { useEffect, useLayoutEffect, useState } from "react";
import LineChart from "../../components/LineChart";
import { TreeSelect, message } from "antd";
import "./ChartsPage.css";

const ChartsPage = () => {
  const [populationByAge, setPopulationByAge] = useState<string[]>();
  const [subjects, setSubjects] = useState<any>();
  const [messageApi] = message.useMessage();
  const notificationKey = "updatable";

  const onPopulationByAgeChange = (newValue: string[]) => {
    console.log(newValue);
    setPopulationByAge(newValue);
  };

  useLayoutEffect(() => {
    message.loading({
      content: "Загружаю список субъектов РФ...",
      duration: 0,
      key: notificationKey,
      style: {
        position: "absolute",
        right: "1em",
        top: "10vh",
      },
    });
  }, []);

  useEffect(() => {
    async function loadSubjects() {
      try {
        let response = await fetch("http://localhost:3002/subjectTree");
        let json = await response.json();
        console.warn(json);
        setSubjects(json);
      } catch (error) {
        message.destroy(notificationKey);
        message.error({
          content: "Не удалось загрузить субъекты РФ",
          style: {
            position: "absolute",
            right: "1em",
            top: "10vh",
          },
        });
        console.error("could not fetch subjects");
      } finally {
        messageApi.destroy();
      }
    }
    loadSubjects();
  }, [messageApi]);

  return (
    <div className="charts">
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
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          value={populationByAge}
          dropdownStyle={{ maxWidth: "100%", maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          multiple
          treeDefaultExpandAll
          onChange={onPopulationByAgeChange}
          treeData={subjects}
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
