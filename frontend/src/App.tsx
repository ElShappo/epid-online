import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthorizationPage from './pages/Authorization/AuthorizationPage';
import SubjectsPage from './pages/Subjects/SubjectsPage';
import subjectsPageLoader from './loaders/subjectsPageLoader';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import "./App.css";
import pageNotFoundLoader from "./loaders/pageNotFoundLoader";


function App() {
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
      element: <NotFoundPage />,
      loader: pageNotFoundLoader,
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} fallbackElement={<div>Hey, I am loading!</div>}/>
    </div>
  );
}

export default App;
