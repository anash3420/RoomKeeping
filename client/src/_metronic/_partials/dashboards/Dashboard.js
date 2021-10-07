import React from "react";
// import { Demo1Dashboard } from "./Demo1Dashboard";
// import { Demo2Dashboard } from "./Demo2Dashboard";
// import { Demo3Dashboard } from "./Demo3Dashboard";
import { AdminDashboard } from "./AdminDashboard";
import { RoomkeeperDashboard } from "./RoomkeeperDashboard";
import StudentDashboard from "./StudentDashboard";
import { ContentRoute } from "../../layout";
// eslint-disable-next-line
import { Switch } from "react-router-dom";

export function Dashboard() {
  // const uiService = useHtmlClassService();
  // const layoutProps = useMemo(() => {
  //     return {
  //         demo: objectPath.get(
  //             uiService.config,
  //             "demo"
  //         )};
  // }, [uiService]);
  return (
    <>
      <Switch>
        <ContentRoute path="/dashboard/admin" component={AdminDashboard} />
        <ContentRoute
          path="/dashboard/roomkeeper"
          component={RoomkeeperDashboard}
        />
        <ContentRoute path="/dashboard/student" component={StudentDashboard} />
      </Switch>
      {/* {layoutProps.demo === 'demo1' && <Demo1Dashboard />}
        {layoutProps.demo === 'demo2' && <Demo2Dashboard />}
        {layoutProps.demo === 'demo3' && <Demo3Dashboard />} */}
    </>
  );
}
