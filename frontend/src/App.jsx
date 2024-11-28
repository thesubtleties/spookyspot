import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from "./components/Navigation/Navigation";
import LandingPage from "./components/LandingPage/LandingPage";
import * as sessionActions from "./store/session";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm/CreateSpotForm";
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm/UpdateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />,
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />,
      },
      {
        path: '/spots/current',
        element: <ManageSpots />,
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
