import React from "react";
import LineChart from "../../components/LineChart";
import './ChartsPage.css'

const ChartsPage = () => {
  return (
    <div className="charts">
      <div className="chart">
        <LineChart xlabels={[1,2,3]} datasets={[{
          data: [1,2,3],
          label: 'first'
        }]}/>
      </div>
      <div className="chart">
        <LineChart xlabels={[1,2,3]} datasets={[{
          data: [1,2,3],
          label: 'first'
        }]}/>
      </div>
      <div className="chart">
        <LineChart xlabels={[1,2,3]} datasets={[{
          data: [1,2,3],
          label: 'first'
        }]}/>
      </div>
    </div>
  )
};

export default ChartsPage;
