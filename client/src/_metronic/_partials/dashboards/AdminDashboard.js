import React, { useEffect } from "react";
import AdminCards from "../cards/AdminCards";
import Axios from "axios";
import { useSelector,shallowEqual } from "react-redux";
import AdminDashboardTable from "../widgets/advance-tables/AdminDashboardTable";

export function AdminDashboard() {
  const [data, setData] = React.useState({});
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const hostel = user.user.hostel;
  useEffect(() => {
    Axios.get(`/api/admin/dashboard?hostel=${hostel}`)
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [hostel]);
  return (
    <>
      <AdminCards requests={data.requests} students={data.students} roomkeepers={data.roomkeepers}/>
      <br />
      <AdminDashboardTable hostel={hostel}/>
    </>
  );
}
