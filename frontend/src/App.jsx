import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Chat from './pages/Chat.jsx'
import { useSelector } from 'react-redux'

function App() {
  const user = useSelector((state) => state.user);

  return (
    <>
      <BrowserRouter>
      <Navigation />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {
            !user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </>
            )
          }
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
      </BrowserRouter>
    </>
  )
}

export default App
