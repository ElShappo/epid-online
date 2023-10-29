import React, { useEffect, useState } from "react";
import LineChart from "../../components/LineChart";
import { TreeSelect, message } from "antd";
import "./ChartsPage.css";

const ChartsPage = () => {
  const [populationByAge, setPopulationByAge] = useState<string[]>();
  const [subjects, setSubjects] = useState<any>();
  const [messageApi] = message.useMessage();
  const loadingMessageKey = "loadingMessage";
  const errorMessageKey = "errorMessage";

  const onPopulationByAgeChange = (newValue: string[]) => {
    console.log(newValue);
    setPopulationByAge(newValue);
  };

  useEffect(() => {
    async function loadSubjects() {
      
      // antd library doesn't supply message component with a delay
      // so I implemented my own version
      // the drawback is that there might be a situation where fetching subjects
      // succeeds before the delay expires - in that case user will have to wait that additional time
      // with that said to improve UX DO NOT SET delay over 1s
      const loadingMessageDelay = 1000;
      let loadingMessagePromise = new Promise(resolve => {
        setTimeout(() => {
          message.loading({
            content: "Загружаю список субъектов РФ...",
            duration: 0,
            key: loadingMessageKey,
            style: {
              position: "absolute",
              right: "1em",
              top: "10vh",
            },
          });
          resolve(undefined);
        }, loadingMessageDelay)
      });

      try {
        // extract only first promise which by the way already contains json with subjects
        // the 2nd promise doesn't return anything useful and is only used to show loadingMessage after the delay expires
        let [json] = await Promise.all([(await fetch("http://localhost:3002/subjectTree")).json(), loadingMessagePromise]);
        setSubjects(json);
      } catch (error) {
        message.error({
          content: "Не удалось загрузить субъекты РФ",
          key: errorMessageKey,
          style: {
            position: "absolute",
            right: "1em",
            top: "10vh",
          },
        });
        console.error("could not fetch subjects");
      } finally {
        message.destroy(loadingMessageKey);
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
          placeholder="Выберите субъекты РФ"
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
