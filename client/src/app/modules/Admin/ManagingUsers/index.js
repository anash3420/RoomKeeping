import React from 'react';
import { Switch } from "react-router-dom";
import RoomKeeper from './RoomKeeper';
import Student from './Student';
import { ContentRoute } from '../../../../_metronic/layout';
export default function Registeration(){
    return (
        <div className="flex-row-fluid lg-12">
        <Switch>
          <ContentRoute
            path="/manage/roomkeeper"
            component={RoomKeeper}
          />
          <ContentRoute
            path="/manage/student"
            component={Student}
          />
        </Switch>
        </div>
    )
}
