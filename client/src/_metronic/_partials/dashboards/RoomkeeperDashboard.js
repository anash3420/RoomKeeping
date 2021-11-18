import React, { useEffect } from "react";
import RoomKeeperDashboardTable from "../widgets/advance-tables/RoomKeeperDashboardTable";
import RoomKeeperCards from "../cards/RoomKeeperCards";
import Axios from "axios";
import { useSelector,shallowEqual } from "react-redux";
export default function RoomkeeperDashboard() {
  const [data, setData] = React.useState({requests: 0,complaints: 0,scheduled: 0, data: []});
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const roomKeeperId = user.user._id;
  const hostel = user.user.hostel;
  const name = user.user.name;
  useEffect(() => {
    Axios.get(`/api/roomkeeper/dashboard?id=${roomKeeperId}&hostel=${hostel}&name=${name}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [roomKeeperId,hostel,name]);
  return (
    <>
      <RoomKeeperCards requests={data.requests} complaints={data.complaints} scheduled={data.scheduled} />
      <br />
      <br />
      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <RoomKeeperDashboardTable hostel={hostel} scheduledRequests = {data.data} onRefresh={(data) => setData(data)} roomKeeperId name/>
        </div>
      </div>
    </>
  );
}
