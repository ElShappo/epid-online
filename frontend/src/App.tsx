import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { ReactNotifications } from "react-notifications-component";
import { lazy } from "react";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import LayoutPage from "./pages/Layout/LayoutPage";
import FAQPage from "./pages/FAQ/FAQPage";
import DescriptionPage from "./pages/Description/DescriptionPage";
import "react-notifications-component/dist/theme.css";

const ProgramsPage = lazy(() => import("./pages/Programs/ProgramsPage"));
const PopulationPage = lazy(() => import("./pages/Programs/Population/PopulationPage"));
const EpidCalculationsPage = lazy(() => import("./pages/Programs/EpidCalculations/EpidCalculationsPage"));
const RussiaMapPage = lazy(() => import("./pages/Programs/RussiaMap/RussiaMapPage"));
const PoissonPage = lazy(() => import("./pages/Programs/Poisson/PoissonPage"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutPage />,
      children: [
        {
          path: "",
          element: <DescriptionPage />,
        },
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
        { path: "/faq", element: <FAQPage /> },
      ],
    },
    {
      path: "/authorization",
      element: <AuthorizationPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
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
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  );
}

export default App;
