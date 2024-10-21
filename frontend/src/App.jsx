import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotsLayout from './components/Spots/SpotsLayout';

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
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/*
        // children: [
        //   {
        //     index: true,
        //     element: <AllSpots />,
        //   },
        //   {
        //     path: ':id',
        //     element: <SpotDetail />,
        //   },
        //   {
        //     path: 'new',
        //     element: <SpotForm />,
        //   },
        //   {
        //     path: 'update',
        //     element: <SpotForm mode="update" />,
        //   },
        // ],
        */
