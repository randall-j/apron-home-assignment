import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import Users from '@/pages/Users';

const router = createBrowserRouter([
  { path: 'users', element: <Users /> },
  {
    path: '*',
    element: <Navigate to="/users" />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
