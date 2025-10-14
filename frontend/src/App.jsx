import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Chat from './pages/Chat.jsx'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { AppContext, socket } from './context/appContext.js'

function App() {
  const user = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({})


  return (
    <>
    <AppContext.Provider value={{ socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, newMessages, setNewMessages }}>
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
      </AppContext.Provider>
    </>
  )
}

export default App
