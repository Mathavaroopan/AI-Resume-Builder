import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './Home/Home'
import Dashboard from './Dashboard/Dashboard.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import SignInPage from './auth/SignIn/SignIn.jsx'
import EditResume from './Dashboard/resume/[resumeId]/edit/EditResume.jsx'
import ViewResume from './my-resume/[resumeId]/view/ViewResume.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "dashboard/resume/:resumeId/edit",
        element: <EditResume />
      }
    ]
  },
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />
  },
  {
    path:'/my-resume/:resumeId/view',
    element:<ViewResume/>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router}/>
    </ClerkProvider>
  </React.StrictMode>,
)
