import React, {useState} from "react";
import { useSubheader } from "../../../../_metronic/layout";
import RegisterRoomkeeper from "./components/RegisterRoomkeeper";
import RoomKeeperList from "./components/RoomKeeper/RoomKeeperList";

const RoomKeeper = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Manage RoomKeeper");
  const [updated,setUpdated] = useState(false);
  const updateTable = () => {
    setUpdated(!updated);
  }
  return (
    <>
      <RegisterRoomkeeper onUpdate={updateTable}/>
      <br />
      <RoomKeeperList reloadTable={updated}/>
    </>
  );
};

export default RoomKeeper;
