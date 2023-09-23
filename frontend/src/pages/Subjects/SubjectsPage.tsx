import React, { useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Button, Layout, TreeSelect } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import TableComponent from '../../components/TableComponent';

const { Header, Content, Sider } = Layout;
const { SHOW_PARENT } = TreeSelect;

interface DataType {
  key: React.Key;
  age: number | string;

  malesFemalesAll: number | string;
  malesAll: number | string;
  femalesAll: number | string;
  proportionAll: number | string;

  malesFemalesCity: number | string;
  malesCity: number | string;
  femalesCity: number | string;
  proportionCity: number | string;

  malesFemalesRural: number | string;
  malesRural: number | string;
  femalesRural: number | string;
  proportionRural: number | string;
}



const SubjectsPage = () => {
  let data: DataType[] = [];
  const columns: ColumnsType<DataType> = [
    {
      title: 'Age (years)',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      fixed: 'left',
      // filters: [
      //   {
      //     text: 'Joe',
      //     value: 'Joe',
      //   },
      //   {
      //     text: 'Category 1',
      //     value: 'Category 1',
      //   },
      //   {
      //     text: 'Category 2',
      //     value: 'Category 2',
      //   },
      // ],
      // filterSearch: true,
      // onFilter: (value: any, record) => String(record.age).startsWith(value),
    },
    {
      title: 'All population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesAll',
          key: 'malesFemalesAll',
          width: 150,
          sorter: (a, b) => +a.malesFemalesAll - +b.malesFemalesAll,
        },
        {
          title: 'Males',
          dataIndex: 'malesAll',
          key: 'malesAll',
          width: 150,
          sorter: (a, b) => +a.malesAll - +b.malesAll,
        },
        {
          title: 'Females',
          dataIndex: 'femalesAll',
          key: 'femalesAll',
          width: 150,
          sorter: (a, b) => +a.femalesAll - +b.femalesAll,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionAll',
          key: 'proportionAll',
          width: 150,
          sorter: (a, b) => +a.proportionAll - +b.proportionAll,
        }
      ],
    },
    {
      title: 'City population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesCity',
          key: 'malesFemalesCity',
          width: 150,
          sorter: (a, b) => +a.malesFemalesCity - +b.malesFemalesCity,
        },
        {
          title: 'Males',
          dataIndex: 'malesCity',
          key: 'malesCity',
          width: 150,
          sorter: (a, b) => +a.malesCity - +b.malesCity,
        },
        {
          title: 'Females',
          dataIndex: 'femalesCity',
          key: 'femalesCity',
          width: 150,
          sorter: (a, b) => +a.femalesCity - +b.femalesCity,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionCity',
          key: 'proportionCity',
          width: 150,
          sorter: (a, b) => +a.proportionCity - +b.proportionCity,
        }
      ],
    },
    {
      title: 'Rural population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesRural',
          key: 'malesFemalesRural',
          width: 150,
          sorter: (a, b) => +a.malesFemalesRural - +b.malesFemalesRural,
        },
        {
          title: 'Males',
          dataIndex: 'malesRural',
          key: 'malesRural',
          width: 150,
          sorter: (a, b) => +a.malesRural - +b.malesRural,
        },
        {
          title: 'Females',
          dataIndex: 'femalesRural',
          key: 'femalesRural',
          width: 150,
          sorter: (a, b) => +a.femalesRural - +b.femalesRural,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionRural',
          key: 'proportionRural',
          width: 150,
          sorter: (a, b) => +a.proportionRural - +b.proportionRural,
        }
      ],
    },
  ];
  const {keys, subjectTree, worksheets}: any = useLoaderData();
  const [value, setValue] = useState(keys);
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
    <Layout>
      <Header>Russian population tracker</Header>
      <Content>
      <Layout style={{ padding: '24px 0', background: 'blue' }}>
          <Sider style={{ background: 'red' }} width={200}>
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
                      <Button type="primary" onClick={onTreeSubmit}>Submit</Button>
                    </>
                  )
                }}
              </Await>
            </React.Suspense>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
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
                  const rowsWithoutSummary = data.slice(2, 103);
                  const summary = data[0];

                  console.log('Parsed data from sheets:');
                  console.warn(data);
                  return (
                    <>
                      <TableComponent rowsWithoutSummary={rowsWithoutSummary} columns={columns} summary={summary}></TableComponent>
                    </>
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