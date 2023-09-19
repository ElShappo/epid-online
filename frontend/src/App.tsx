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


function App() {
  const router = createBrowserRouter([
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "/subjects/:keys",
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
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<div>Hey, I am loading!</div>}/>
    </Provider>
  );
}

export default App;
