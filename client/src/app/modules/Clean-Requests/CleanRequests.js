import React from "react";
import { useSelector } from "react-redux";
import AdminPage from "./AdminPage";
import RoomKeeperPage from "./RoomKeeperPage";
import StudentPage from "./StudentPage";
function CleanRequests() {
  const role = useSelector(({ auth }) => auth.user.role);
  return <div>
        {role === "admin" && <AdminPage />}
        {role === "roomkeeper" && <RoomKeeperPage />}
        {role === "student" && <StudentPage />}
        </div>;
}

export default CleanRequests;
