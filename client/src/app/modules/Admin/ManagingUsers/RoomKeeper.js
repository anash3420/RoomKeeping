import React from "react";
import { useSubheader } from "../../../../_metronic/layout";
import RegisterRoomkeeper from "./components/RegisterRoomkeeper";
const RoomKeeper = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Manage RoomKeeper");

  return (
    <>
      <RegisterRoomkeeper />
    </>
  );
};

export default RoomKeeper;
