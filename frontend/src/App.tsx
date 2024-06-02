import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import pageNotFoundLoader from "./loaders/pageNotFoundLoader";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { ConfigProvider, theme } from "antd";
import PopulationPage from "./pages/Population/PopulationPage";
import CalculationsPage from "./pages/Calculations/CalculationsPage";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import ProgramsPage from "./pages/Programs/ProgramsPage";
import CalculationsCharts from "./components/CalculationsCharts/CalculationsCharts";
import CalculationsIntervals from "./components/CalculationsIntervals/CalculationsIntervals";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        {
          path: "programs",
          element: <ProgramsPage />,
        },
        {
          path: "programs/population",
          element: <PopulationPage />,
        },
        {
          path: "programs/calculations",
          element: <CalculationsPage />,
        },
        {
          path: "programs/map",
          element: <CalculationsCharts />,
        },
        {
          path: "programs/poisson",
          element: <CalculationsIntervals />,
        },
      ],
    },
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
      loader: pageNotFoundLoader,
    },
  ]);

  return (
    <>
      <ReactNotifications />
      <ConfigProvider
        theme={{
          // 1. Use dark algorithm
          algorithm: theme.darkAlgorithm,

          // 2. Combine dark algorithm and compact algorithm
          // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        }}
      >
        <RouterProvider router={router} fallbackElement={<div>Hey, I am loading!</div>} />
      </ConfigProvider>
    </>
  );
}

export default App;
