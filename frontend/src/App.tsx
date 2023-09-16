import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { AuthorizationContext } from './globalStore/index'
import AuthorizationPage from './pages/Authorization/AuthorizationPage';
import SubjectsPage from './pages/Subjects/SubjectsPage';
import subjectsPageLoader from './loaders/subjectsPageLoader';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/authorization",
    element: <AuthorizationPage />,
  },
  {
    path: "/subjects/:subjectName",
    element: <SubjectsPage />,
    loader: subjectsPageLoader,
  },
  {
    path: "*",
    element: <NotFoundPage />
  }

]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
