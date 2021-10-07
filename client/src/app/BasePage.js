import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import {useSelector} from 'react-redux';
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { DashboardPage } from "./pages/DashboardPage";
const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);
const ManageUsers = lazy(() =>
  import("./modules/Admin/ManagingUsers/index")
);

export default function BasePage() {
  const role = useSelector(({auth}) => auth.user.role);
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to= {`/dashboard/${role}`} />
        }
        <ContentRoute path={`/dashboard/${role}`} component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <Route path="/user-profile" component={UserProfilepage} />

        {/* To-Do Provide Access Based on roles*/}

        {/* Admin Access */}
        {role === 'admin' && <ContentRoute path="/manage" component={ManageUsers} />}

        {/* RoomKeeper Access */}

        {/* Student Access */}


        {/* End */}
        <Redirect to="/error/error-v5" />
      </Switch>
    </Suspense>
  );
}
