import React, { useEffect } from "react";
import AdminCards from "../cards/AdminCards";
import Axios from "axios";
import { useSelector,shallowEqual } from "react-redux";
import AdminDashboardTable from "../widgets/advance-tables/AdminDashboardTable";

export function AdminDashboard() {
  const [data, setData] = React.useState({requests: 0,students: 0,roomkeepers: 0,data: []});
  const [loading, setLoading] = React.useState(true);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const hostel = user.user.hostel;
  useEffect(() => {
    Axios.get(`/api/admin/dashboard?hostel=${hostel}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
        setLoading(false);
      });
  }, [hostel]);
  return (
    <>
      <AdminCards requests={data.requests} students={data.students} roomkeepers={data.roomkeepers}/>
      <br />
      <AdminDashboardTable hostel={hostel} requests={data.data} onRefresh={(data) => setData(data)} loading={loading}/>
    </>
  );
}
