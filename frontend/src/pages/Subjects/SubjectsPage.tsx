import React, { useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Button, Input, Layout, TreeSelect } from 'antd';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent';
import { DataType } from '../../types';
import { columns } from '../../constants';
import './SubjectsPage.css';

const { Header, Content, Sider } = Layout;
const { SHOW_PARENT } = TreeSelect;

const SubjectsPage = () => {
  let data: DataType[] = [];

  const {keys, subjectTree, worksheets}: any = useLoaderData();
  const [value, setValue] = useState(keys);
  const [searchedText, setSearchedText] = useState("");
  const navigate = useNavigate();
  
  const onChange = (newValue: string[]) => {
    console.log('Old value: ', value);
    console.log('New value: ', newValue);
    setValue(newValue);
  };

  const onTreeSubmit = () => {
    console.log(`Submitting keys = ${value}`);
    let url = `/subjects/${value}`;
    navigate(url);
  }

  return (
    <Layout className='top-layout'>
      <Header className='header'>
        <h1>Russian population tracker</h1>
      </Header>

      <Content className='content'>
        <Layout className='content-layout'>
          <Sider width={250} className='sider'>
            <React.Suspense fallback={<div>Loading tree of subjects...</div>}>
              <Await
                resolve={subjectTree}
                errorElement={
                  <div>Could not load tree of subjects 😬</div>
                }
              >
                {(resolved) => {
                  console.log('Subject tree has been loaded');
                  console.log(resolved);

                  const tProps = {
                    treeData: resolved,
                    value,
                    onChange,
                    treeCheckable: true,
                    showCheckedStrategy: SHOW_PARENT,
                    placeholder: 'Please select',
                    style: {
                      width: '100%',
                    },
                  };
                  return (
                    <>
                      <TreeSelect {...tProps} />
                      <Button type="primary" onClick={onTreeSubmit} className='submit-tree'>Submit</Button>
                    </>
                  )
                }}
              </Await>
            </React.Suspense>
          </Sider>
          <Content className='content-table'>
            <React.Suspense fallback={<div>Loading table...</div>}>
              <Await
                resolve={worksheets}
                errorElement={
                  <div>Could not load table 😬</div>
                }
              >
                {(resolved) => {
                  console.log('Data from sheet(-s) has been loaded');
                  console.log(resolved);

                  // 'data' includes all rows (summary; work group ages; and others)
                  // 0-th element of 'data' is summary
                  // 1st element of 'data' isn't of interest to us because it contains 'в том числе в возрасте, лет'
                  // work group ages are 103-105 indices - they are also out of interest for us
                  data = resolved.map((row: any, i: number) => {
                    return {
                      key: i,
                      age: row[0],

                      malesFemalesAll: row[1],
                      malesAll: row[2],
                      femalesAll: row[3],
                      proportionAll: (row[3] / row[2]).toFixed(2),

                      malesFemalesCity: row[4],
                      malesCity: row[5],
                      femalesCity: row[6],
                      proportionCity: (row[6] / row[5]).toFixed(2),

                      malesFemalesRural: row[7],
                      malesRural: row[8],
                      femalesRural: row[9],
                      proportionRural: (row[9] / row[8]).toFixed(2),
                    }
                  });

                  // don't include first two elements from 'data' and work group ages
                  let rowsWithoutSummary = data.slice(2, 103);
                  const summary = data[0];

                  function parser(row: any) {
                    let input = searchedText.trim();
                    let reg = /^(\d+(-|, ))*\d+$/;
                    let age = String(row.age).trim() as string | number;

                    if (age === 'до 1') {
                      age = 0;
                    }
                    if (age === '100 и более') {
                      age = 100;
                    }

                    if (input.match(reg) ) {
                      let rangeReg = /\d+-\d+/g
                      let rangeMatches = input.match(rangeReg);
                      if (rangeMatches) {
                        for (let rangeMatch of rangeMatches) {
                          let [left, right] = rangeMatch.match(/\d+/g) as any;
                          if (+age >= +left && +age <= +right) {
                            return true;
                          }
                        }
                      }
                      let singleNumberReg = /(?:^| )(\d+)(?:,|$)/g
                      let singleNumberMatches = Array.from(input.matchAll(singleNumberReg) );

                      for (let singleNumberMatch of singleNumberMatches) {
                        let num = singleNumberMatch[1];
                        if (+age === +num)  {
                          return true;
                        }
                      }
                    }
                    return false;
                  }

                  if (searchedText) {
                    rowsWithoutSummary = rowsWithoutSummary.filter(parser);
                  }

                  console.log('Parsed data from sheets:');
                  console.warn(data);
                  return (
                    <div className='table-with-input'>
                      <Input.Search className='search-age' placeholder='Choose age(-s)...' onSearch={(value) => {
                        setSearchedText(value);
                      }}></Input.Search>
                      <TableComponent rowsWithoutSummary={rowsWithoutSummary} columns={columns} summary={!searchedText ? summary : undefined}></TableComponent>
                    </div>
                  )
                }}
              </Await>
            </React.Suspense>
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
}

export default SubjectsPage