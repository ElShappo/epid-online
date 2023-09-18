import React, { useState } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Layout, TreeSelect } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { SHOW_PARENT } = TreeSelect;

const SubjectsPage = () => {
  const {keys, subjectTree, worksheets}: any = useLoaderData();
  const [value, setValue] = useState(keys);
  const navigate = useNavigate();
  
  const onChange = (newValue: string[]) => {
    console.log('Old value: ', value);
    console.log('New value: ', newValue);

    let url = '/subjects';
    let queryParams = newValue.map(key => `key=${key}`).join('&');

    setValue(newValue);
    navigate(url + '?' + queryParams);
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
                  return <TreeSelect {...tProps} />
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
                  const markup = { __html: resolved };
                  return (
                    <div dangerouslySetInnerHTML={markup}></div>
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