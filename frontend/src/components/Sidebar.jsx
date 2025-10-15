import React, { useContext, useEffect, useMemo, useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import '../styles/Sidebar.css';

function Sidebar() {
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members = [],
    setRooms,
    setCurrentRoom,
    setPrivateMemberMsg,
    rooms = [],
    currentRoom,
    privateMemberMsg,
    messages = []
  } = useContext(AppContext);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  function handleViewProfile(member) {
    setSelectedMember(member);
    setShowProfile(true);
  }

  function joinRoom(room, isPublic = true) {
    if (!user) return alert("Please login");

    socket.emit("join_room", room);
    setCurrentRoom(room);

    if (isPublic) setPrivateMemberMsg(null);
  }

  const getRooms = () => {
    fetch("http://localhost:5000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  };

  useEffect(() => {
    if (!user) return;

    setCurrentRoom("general");
    getRooms();
    socket.emit("join_room", "general");
    socket.emit("new_user");

    socket.on("new_user", (payload) => setMembers(payload));

    return () => socket.off("new_user");
  }, [user, socket, setMembers, setCurrentRoom, setRooms]);

  // Ordenar miembros según mensaje más reciente
  const sortedMembers = useMemo(() => {
    if (!Array.isArray(members) || !user) return members;

    const me = members.find(m => String(m._id) === String(user.id));
    const otherMembers = members.filter(m => String(m._id) !== String(user.id));

    // Para cada miembro, obtener timestamp del último mensaje
    const membersWithLastMsg = otherMembers.map(member => {
      const msgs = messages.filter(
        msg =>
          (msg.from === user.id && msg.to === member._id) ||
          (msg.from === member._id && msg.to === user.id)
      );
      const lastMsgTime = msgs.length > 0 ? Math.max(...msgs.map(m => new Date(m.createdAt).getTime())) : 0;
      return { ...member, lastMsgTime };
    });

    // Orden descendente por lastMsgTime (más recientes arriba)
    membersWithLastMsg.sort((a, b) => b.lastMsgTime - a.lastMsgTime);

    return me ? [me, ...membersWithLastMsg] : membersWithLastMsg;
  }, [members, user, messages]);

  function orderIds(id1, id2) {
    return id1 > id2 ? id1 + "-" + id2 : id2 + "-" + id1;
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user.id, member._id);
    joinRoom(roomId, false);
  }

  if (!user) return null;

  return (
    <>
      <h2>Available Rooms</h2>
      <ListGroup className="mb-3">
        {rooms.map((room, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <span>{room}</span>
            <i className="fa-solid fa-square-plus plus-icon"></i>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2>Members</h2>
      <ListGroup>
        {sortedMembers.map(member => (
          <ListGroup.Item
            key={member._id}
            className="d-flex justify-content-between align-items-center"
            active={privateMemberMsg && String(privateMemberMsg._id) === String(member._id)}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={String(member._id) === String(user.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              {member.picture && (
                <img
                  src={member.picture}
                  alt={member.name}
                  style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleViewProfile(member);
                  }}
                />
              )}
              {member.name || member.email}
              {String(member._id) === String(user.id) && " (You)"}
            </div>

          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal de perfil */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div className="text-center">
              <img
                src={selectedMember.picture}
                alt={selectedMember.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '10px'
                }}
              />
              <h5>{selectedMember.name}</h5>
              <p>Status: {selectedMember.status || "Offline"}</p>
              <p>Member since: {selectedMember.createdAt ? new Date(selectedMember.createdAt).toLocaleDateString() : "Unknown"}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Sidebar;
