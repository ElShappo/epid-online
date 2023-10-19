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
import { Provider } from "react-redux";
import store from "./globalStore/store";
import ChartsPage from "./pages/Charts/ChartsPage";
import chartsPageLoader from "./loaders/chartsPageLoader";
import { MainPage } from "./pages/Main/MainPage";


function App() {
  const router = createBrowserRouter([
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "/main",
      element: <MainPage />,
      children: [
        {
          path: "subjects/:keys",
          element: <SubjectsPage />,
          loader: subjectsPageLoader,
        },
        {
          path: "charts",
          element: <ChartsPage />,
          loader: chartsPageLoader,
        }
      ]
    },
    {
      path: "*",
      element: <NotFoundPage />,
      loader: pageNotFoundLoader,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<div>Hey, I am loading!</div>}/>
    </Provider>
  );
}

export default App;
