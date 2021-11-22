/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_helpers";
import CircularProgress from "@material-ui/core/CircularProgress";
import CompleteDialog from "../dialogues/CompleteDialog";
import { RejectDialog } from "../dialogues/RejectDialog";

export default function RoomkeeperDashboardTable({
  hostel,
  scheduledRequests,
  onRefresh,
  roomKeeperId,
  name,
  loading,
}) {
  const [rejectData, setRejectData] = useState({});
  const [rejectShow, setRejectShow] = useState(false);
  const [completedData, setCompletedData] = useState({});
  const [completedShow, setCompletedShow] = useState(false);
  return (
    <>
      {/* begin::Advance Table Widget 9 */}
      <div className={`card card-custom`}>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              {hostel}
            </span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">
              Your Scheduled Clean Requests.
            </span>
          </h3>
          <div className="card-toolbar">
            <Link
              to="/clean-requests"
              className="btn btn-info font-weight-bolder font-size-sm mr-3"
            >
              View All Requests
            </Link>
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body pt-0 pb-3">
          <div className="tab-content">
            {/* begin::Table */}
            <div className="table-responsive">
              {!loading ? (
                scheduledRequests.length > 0 ? (
                  <table className="table table-head-custom table-vertical-center table-head-bg table-borderless">
                    <thead>
                      <tr className="text-left">
                        <th
                          style={{ minWidth: "100px" }}
                          className="text-center"
                        >
                          Room
                        </th>
                        <th
                          style={{ minWidth: "100px" }}
                          className="text-center"
                        >
                          Floor
                        </th>
                        <th
                          style={{ minWidth: "100px" }}
                          className="text-center"
                        >
                          Student Contact
                        </th>
                        <th
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          Date
                        </th>
                        <th
                          style={{ minWidth: "150px" }}
                          className="text-center"
                        >
                          time requested
                        </th>
                        <th
                          style={{ minWidth: "300px" }}
                          className="text-center"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledRequests.map(({ request, studentData }) => {
                        return (
                          <tr className="text-center">
                            <td className="pl-0 py-8 ">
                              <span className="text-dark-75 font-weight-bolder  mb-1 font-size-lg">
                                {request.room}
                              </span>
                              {/* <span className="text-muted font-weight-bold d-block">
                            HTML, JS, ReactJS
                          </span> */}
                            </td>
                            <td>
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                {request.floor}
                              </span>
                            </td>
                            <td>
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                {studentData.email}
                              </span>
                              <span className="text-muted font-weight-bold">
                                {studentData.phone
                                  ? "+" + studentData.phone
                                  : ""}
                              </span>
                            </td>
                            <td>
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                {request.date}
                              </span>
                            </td>
                            <td>
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                {request.time}
                              </span>
                            </td>
                            <td className="pr-0">
                              <div className="float-left ml-4">
                                <button
                                  className="btn btn-success btn-elevate btn-shadow-hover btn-sm"
                                  onClick={() => {
                                    setCompletedShow(true);
                                    setCompletedData({
                                      id: request._id,
                                      room: request.room,
                                      floor: request.floor,
                                      date: request.date,
                                      time: request.time,
                                    });
                                  }}
                                >
                                  <span className="svg-icon">
                                    <SVG
                                      className="svg-icon svg-icon-primary"
                                      src={toAbsoluteUrl(
                                        "/media/svg/icons/Navigation/Double-check.svg"
                                      )}
                                      title="Mark As Completed"
                                    />
                                  </span>
                                  Mark As Completed
                                </button>
                              </div>
                              <div className=" ">
                                <button
                                  title="Reject Clean-Request"
                                  className="btn btn-light-danger btn-sm font-weight-bold text-right"
                                  onClick={() => {
                                    setRejectShow(true);
                                    setRejectData({
                                      id: request._id,
                                      role: "roomkeeper",
                                      name: roomKeeperId,
                                      room: request.room,
                                      floor: request.floor,
                                      date: request.date,
                                      time: request.time,
                                    });
                                  }}
                                >
                                  <span className="svg-icon mr-0">
                                    <SVG
                                      className="svg-icon svg-icon-primary mr-1"
                                      src={toAbsoluteUrl(
                                        "/media/svg/icons/Design/Component.svg"
                                      )}
                                      title="Reject Clean-Request"
                                    />
                                  </span>
                                  Reject Request
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="bgi-no-repeat text-center">
                    <img
                      src={toAbsoluteUrl(
                        "/media/svg/illustrations/progress.svg"
                      )}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        minWidth: "50%",
                        minHeight: "50%",
                      }}
                      alt="image"
                    />
                    <h1 className="text-center m-4 p-4 text-success font-weight-bolder">
                      <span className="svg-icon svg-icon-6x svg-icon-success">
                        <SVG
                          className=" mr-1"
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Code/Done-circle.svg"
                          )}
                          title="Reject Clean-Request"
                        />
                      </span>
                      No Pending Clean-Request!
                    </h1>
                  </div>
                )
              ) : (
                <div className="text-center mt-4 pt-4 pb-4 mb-4 text-info">
                  <CircularProgress color="inherit" size={50} />
                </div>
              )}
            </div>
            {/* end::Table */}
          </div>
        </div>
        {/* end::Body */}
      </div>

      <RejectDialog
        roomKeeperId={roomKeeperId}
        name
        data={rejectData}
        hostel={hostel}
        onRefreshTable={(data) => {
          onRefresh(data);
        }}
        show={rejectShow}
        onHide={() => {
          setRejectShow(false);
        }}
      />
      <CompleteDialog
        hostel={hostel}
        name
        data={completedData}
        onRefreshTable={(data) => {
          onRefresh(data);
        }}
        show={completedShow}
        onHide={() => {
          setCompletedShow(false);
        }}
        roomKeeperId={roomKeeperId}
      />
      {/* end::Advance Table Widget 9 */}
    </>
  );
}
