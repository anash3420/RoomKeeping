import React, { useEffect } from "react";
import { AdvanceTablesWidget9 } from "../widgets/advance-tables/AdvanceTablesWidget9";
import StudentCards from "../cards/StudentCards";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
export default function StudentDashboard() {
  const [data, setData] = React.useState({requests:0,scheduled:0,completed:0,data:[]});
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const studentid = user.user._id;
  const hostel = user.user.hostel;
  useEffect(() => {
    Axios.get(`/api/student/dashboard?id=${studentid}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studentid]);

  return (
    <>
      <StudentCards
        requests={data.requests}
        scheduled={data.scheduled}
        completed={data.completed}
      />
      <br />
      <br />
      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <AdvanceTablesWidget9
            className="card-stretch gutter-b"
            hostel={hostel}
            data={data.data}
            studentId={studentid}
            onRefresh={(refreshData) => {
              setData(refreshData);
            }}
          />
        </div>
      </div>
    </>
  );
}
