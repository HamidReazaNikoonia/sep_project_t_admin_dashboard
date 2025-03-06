import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'
import Index from './pages/Index'
import Login from './pages/Login'
import Notfound from './pages/Notfound'

// Users
import UserList from './pages/Users/UserList/index';
import UserSpecific from './pages/Users/UserSpecific/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/users',
    element: (
      <Layout>
        <UserList />
      </Layout>
    )
  },
  {
    path: '/users/:user_id',
    element: (
      <Layout>
        <UserSpecific />
      </Layout>
    )
  },
  {
    path: '*',
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
])

export default router
