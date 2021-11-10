import React, { useEffect } from "react";
import { AdvanceTablesWidget9 } from "../widgets/advance-tables/AdvanceTablesWidget9";
import StudentCards from "../cards/StudentCards";
import Axios from "axios";
import { useSelector,shallowEqual } from "react-redux";
export default function StudentDashboard() {
  const [data, setData] = React.useState({});
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const studentid = user.user._id;
  useEffect(() => {
    Axios.get(`/api/student/dashboard?id=${studentid}`)
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studentid]);
  return (
    <>
      <StudentCards requests={data.requests} complaints={data.complaints} suggestions={data.suggestions} />
      <br />
      <br />
      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <AdvanceTablesWidget9 className="card-stretch gutter-b" />
        </div>
      </div>
    </>
  );
}
