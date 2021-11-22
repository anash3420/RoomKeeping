/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_helpers";
import AdminAllotDialog from "../dialogues/AdminAllotDialog";
import { RejectDialog } from "../dialogues/RejectDialog";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AdminDashboardTable({
  hostel,
  requests,
  onRefresh,
  loading,
}) {
  const [rejectData, setRejectData] = useState({});
  const [rejectShow, setRejectShow] = useState(false);
  const [allotData, setAllotData] = useState({});
  const [allotShow, setAllotShow] = useState(false);
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
              Manage Pending Clean Requests.
            </span>
          </h3>
          <div className="card-toolbar">
            <Link
              to="/clean-requests"
              className="btn btn-info font-weight-bolder font-size-sm mr-3"
            >
              View Requests
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
                requests !== undefined && requests.length > 0 ? (
                  <>
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
                            style={{ minWidth: "150px" }}
                            className="text-center"
                          >
                            Date
                          </th>
                          <th
                            style={{ minWidth: "150px" }}
                            className="text-center"
                          >
                            Time Requested
                          </th>
                          <th
                            style={{ minWidth: "200px" }}
                            className="text-center"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => {
                          return (
                            <tr className="text-center">
                              <td className="pl-0 py-8 ">
                                <span
                                  href="#"
                                  className="text-dark-75 font-weight-bolder  mb-1 font-size-lg"
                                >
                                  {request.room}
                                </span>
                              </td>
                              <td>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                  {request.floor}
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
                                <div
                                  className="float-left mb-4"
                                  style={{ marginLeft: "6rem" }}
                                >
                                  {request.rejectReason === undefined ? (
                                    <button
                                      className="btn btn-info btn-elevate btn-shadow-hover btn-md"
                                      onClick={() => {
                                        setAllotShow(true);
                                        setAllotData({
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
                                            "/media/svg/icons/Clothes/Cap.svg"
                                          )}
                                          title="Allot RoomKeeper"
                                        />
                                      </span>
                                      Allot
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-warning btn-elevate btn-shadow-hover btn-md"
                                      onClick={() => {
                                        setAllotShow(true);
                                        setAllotData({
                                          rejectData: request.rejectReason,
                                          id: request._id,
                                          room: request.room,
                                          floor: request.floor,
                                          date: request.date,
                                          time: request.time,
                                        });
                                      }}
                                    >
                                      <span className="svg-icon mr-0">
                                        <SVG
                                          className="svg-icon svg-icon-warning"
                                          src={toAbsoluteUrl(
                                            "/media/svg/icons/Text/Redo.svg"
                                          )}
                                          title="Allot RoomKeeper"
                                        />
                                      </span>
                                      Re-Allot
                                    </button>
                                  )}
                                </div>
                                <div
                                  className="float-right mb-4"
                                  style={{ marginRight: "1rem" }}
                                >
                                  <button
                                    title="Reject Clean-Request"
                                    className="btn btn-light-danger btn-md font-weight-bold"
                                    onClick={() => {
                                      setRejectShow(true);
                                      setRejectData({
                                        id: request._id,
                                        role: "admin",
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
                  </>
                ) : (
                  <React.Fragment>
                    <div
                      className="bgi-no-repeat p-10 p-lg-10"
                      style={{
                        backgroundImage: `url(${toAbsoluteUrl(
                          "/media/svg/illustrations/data-points.svg"
                        )})`,
                        height: "250px",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      <h1 className="display-2 text-center m-4 p-4 text-success font-weight-bolder">
                        <span className="svg-icon svg-icon-6x svg-icon-success">
                          <SVG
                            className=" mr-1"
                            src={toAbsoluteUrl(
                              "/media/svg/icons/Code/Done-circle.svg"
                            )}
                            title="Reject Clean-Request"
                          />
                        </span>
                        Your'e All Caught!
                      </h1>
                    </div>
                  </React.Fragment>
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
      <AdminAllotDialog
        data={allotData}
        hostel={hostel}
        onRefreshTable={(data) => {
          onRefresh(data);
        }}
        show={allotShow}
        onHide={() => {
          setAllotShow(false);
        }}
      />
      {/* end::Advance Table Widget 9 */}
    </>
  );
}
