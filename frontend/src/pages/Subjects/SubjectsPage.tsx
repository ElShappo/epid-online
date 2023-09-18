import React, { useEffect, useState } from 'react';
import { Await, useLoaderData, useLocation } from 'react-router-dom';
import { Button, Layout, TreeSelect } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Header, Content, Sider } = Layout;
const { SHOW_PARENT } = TreeSelect;

interface DataType {
  key: React.Key;
  age: number | string;

  malesFemalesAll: number | string;
  malesAll: number | string;
  femalesAll: number | string;

  malesFemalesCity: number | string;
  malesCity: number | string;
  femalesCity: number | string;

  malesFemalesRural: number | string;
  malesRural: number | string;
  femalesRural: number | string;
}


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
    //     text: 'John',
    //     value: 'John',
    //   },
    // ],
    // onFilter: (value: string | number | boolean, record: any) => record.name.indexOf(value) === 0,
  },
  {
    title: 'All population',
    children: [
      {
        title: 'Males and females',
        dataIndex: 'malesFemalesAll',
        key: 'malesFemalesAll',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Males',
        dataIndex: 'malesAll',
        key: 'malesAll',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Females',
        dataIndex: 'femalesAll',
        key: 'femalesAll',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
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
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Males',
        dataIndex: 'malesCity',
        key: 'malesCity',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Females',
        dataIndex: 'femalesCity',
        key: 'femalesCity',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
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
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Males',
        dataIndex: 'malesRural',
        key: 'malesRural',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Females',
        dataIndex: 'femalesRural',
        key: 'femalesRural',
        width: 150,
        // sorter: (a, b) => a.age - b.age,
      },
    ],
  },
];

const SubjectsPage = () => {
  const data: DataType[] = [];
  let location = useLocation();
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
    let url = '/subjects';
    let queryParams = value.map((key: any) => `key=${key}`).join('&');
    navigate(url + '?' + queryParams);
  }

  useEffect(() => {
    console.log('Query parameters changed');
  }, [location])

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
                  // console.warn(resolved);
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
                  console.log('Got data from sheets:');
                  console.warn(resolved);
                  resolved.forEach((row: any, i: number) => {
                    data.push({
                      key: i,
                      age: row[0],

                      malesFemalesAll: row[1],
                      malesAll: row[2],
                      femalesAll: row[3],

                      malesFemalesCity: row[4],
                      malesCity: row[5],
                      femalesCity: row[6],

                      malesFemalesRural: row[7],
                      malesRural: row[8],
                      femalesRural: row[9],
                    });
                  });
                  console.log('Parsed data from sheets:');
                  console.warn(data);
                  return (
                    <>
                      <Table
                        columns={columns}
                        dataSource={data}
                        bordered
                        size="middle"
                        scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                      />
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