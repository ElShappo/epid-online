import React, { useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Layout, TreeSelect } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SHOW_PARENT } = TreeSelect;

const SubjectsPage = () => {
  const {subjectTree, worksheets, promise}: any = useLoaderData();
  const [value, setValue] = useState(['2.1.']);
  
  const onChange = (newValue: string[]) => {
    console.log('onChange ', value);
    setValue(newValue);
  };

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
                  console.warn(resolved);
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
                  return <TreeSelect {...tProps} />
                }}
              </Await>
            </React.Suspense>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <React.Suspense fallback={<div>Loading subjects...</div>}>
              <Await
                resolve={promise}
                errorElement={
                  <div>Could not load subjects 😬</div>
                }
              >
                {(resolved) => <div>Resolved value: {resolved}</div>}
              </Await>
            </React.Suspense>
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
}

export default SubjectsPage