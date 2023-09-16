import React, { useContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthorizationContext } from './globalStore/index'
import AuthorizationPage from './pages/Authorization/AuthorizationPage';
import SubjectsPage from './pages/Subjects/SubjectsPage';
import subjectsPageLoader from './loaders/subjectsPageLoader';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import "./App.css";


function App() {
  const authorization = useContext(AuthorizationContext);

  const router = createBrowserRouter([
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "/subjects/:subjectName",
      element: authorization === 'authorized' ? <SubjectsPage /> : <AuthorizationPage />,
      loader: subjectsPageLoader,
    },
    {
      path: "*",
      element: authorization === 'authorized' ? <NotFoundPage /> : <AuthorizationPage />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} fallbackElement={<div>Hey, I am loading!</div>}/>
    </div>
  );
}

export default App;
