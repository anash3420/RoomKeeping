import React from "react";
import { useSubheader } from "../../../../_metronic/layout";
import RegisterStudent from "./components/RegisterStudent";
const Student = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Manage Student");

  return (
    <>
      <RegisterStudent />
    </>
  );
};

export default Student;
