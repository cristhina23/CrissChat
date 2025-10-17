import React, { useContext, useEffect, useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "../styles/Sidebar.css";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members,
    setRooms,
    rooms,
    setCurrentRoom,
    setPrivateMemberMsg,
    currentRoom,
    privateMemberMessage,
  } = useContext(AppContext);

  socket.off("new_message").on("new_message", (payload) => {
    console.log(payload)
  })
 

  function getRooms() {
    fetch(`${import.meta.env.VITE_API_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      });
  }

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join_room", "general");
      socket.emit("new_user", user);

      socket.on("new_user", (members) => {
      setMembers(members);
    });
  
    }

  }, [user]);

  if (!user) return <></>;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, idx) => (
          <ListGroup.Item
            key={idx}
            style={{ cursor: "pointer" }}
            
          >
            {room}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
       {members.map((member) => (
         <ListGroup.Item key={member.id} style={{cursor: "pointer"}}>
           {member.name}
         </ListGroup.Item>
       ))}
      </ListGroup>
    </>
  );
}

export default Sidebar;
