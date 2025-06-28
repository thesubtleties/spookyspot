import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotsLayout from './components/Spots/SpotsLayout';
import AllSpots from './components/Spots/AllSpots';
import SpotDetail from './components/Spots/SpotDetail';
import SpotForm from './components/Spots/SpotForm';
import ManageSpots from './components/Spots/ManageSpots';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <ScrollRestoration />
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
        element: <SpotsLayout />,
        children: [
          {
            index: true,
            element: <AllSpots />,
          },
          {
            path: 'spots/:spotId/edit',
            element: <SpotForm mode="update" />,
          },
          {
            path: 'spots/new',
            element: <SpotForm />,
          },
          {
            path: 'spots/:spotId',
            element: <SpotDetail />,
          },
          {
            path: 'profile',
            element: <ManageSpots />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
