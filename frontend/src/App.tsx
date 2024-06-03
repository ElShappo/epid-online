import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import pageNotFoundLoader from "./loaders/pageNotFoundLoader";
import { ConfigProvider, theme } from "antd";
import { ReactNotifications } from "react-notifications-component";
import { lazy } from "react";
import "react-notifications-component/dist/theme.css";
import PageLayout from "./pages/PageLayout/PageLayout";

const ProgramsPage = lazy(() => import("./pages/Programs/ProgramsPage"));
const PopulationPage = lazy(() => import("./pages/Programs/Population/PopulationPage"));
const EpidCalculationsPage = lazy(() => import("./pages/Programs/EpidCalculations/EpidCalculationsPage"));
const RussiaMapPage = lazy(() => import("./pages/Programs/RussiaMap/RussiaMapPage"));
const PoissonPage = lazy(() => import("./pages/Programs/Poisson/PoissonPage"));

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
          element: <EpidCalculationsPage />,
        },
        {
          path: "programs/map",
          element: <RussiaMapPage />,
        },
        {
          path: "programs/poisson",
          element: <PoissonPage />,
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
