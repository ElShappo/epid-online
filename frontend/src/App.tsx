import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import RegionsPage from "./pages/Subjects/RegionsPage";
import subjectsPageLoader from "./loaders/subjectsPageLoader";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import pageNotFoundLoader from "./loaders/pageNotFoundLoader";
import ChartsPage from "./pages/Charts/ChartsPage";
import chartsPageLoader from "./loaders/chartsPageLoader";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { ConfigProvider, theme } from "antd";

function App() {
  const router = createBrowserRouter([
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "/main",
      element: <PageLayout />,
      children: [
        {
          path: "subjects/:year",
          // element: <SubjectsPage />,
          element: <RegionsPage />,
          loader: subjectsPageLoader,
        },
        {
          path: "charts/:year",
          element: <ChartsPage />,
          loader: chartsPageLoader,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
      loader: pageNotFoundLoader,
    },
  ]);

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <RouterProvider
        router={router}
        fallbackElement={<div>Hey, I am loading!</div>}
      />
    </ConfigProvider>
  );
}

export default App;
