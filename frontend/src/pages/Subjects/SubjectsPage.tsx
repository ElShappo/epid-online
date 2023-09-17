import React from 'react'
import { Await, useLoaderData } from 'react-router-dom'

const SubjectsPage = () => {
  const {subjects, promise}: any = useLoaderData();
  return (
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
  )
}

export default SubjectsPage