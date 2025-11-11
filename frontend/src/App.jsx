import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashBoard from './pages/DashBoard'
function App() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token")
    return token ? children : <Navigate to="/login" />;

  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
