import React, { useState } from "react";
import { useSubheader } from "../../../../_metronic/layout";
import RegisterStudent from "./components/RegisterStudent";
import StudentList from "./components/Student/StudentList";
const Student = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Manage Student");
  const [updated,setUpdated] = useState(false);
  const updateTable = () => {
    setUpdated(!updated);
  }
  return (
    <>
      <RegisterStudent onUpdate={updateTable} />
      <br />
      <StudentList reloadTable={updated} />
    </>
  );
};

export default Student;
