import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import pageNotFoundLoader from "./loaders/pageNotFoundLoader";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { ConfigProvider, theme } from "antd";
import PopulationPage from "./pages/Population/PopulationPage";
import CalculationsPage from "./pages/Calculations/CalculationsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "/",
      element: <PageLayout />,
      children: [
        {
          path: "population",
          element: <PopulationPage />,
        },
        {
          path: "calculations",
          element: <CalculationsPage />,
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
