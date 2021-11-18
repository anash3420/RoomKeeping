/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_helpers";
import StudentDeleteDialog from "../dialogues/StudentDeleteDialog";

export function AdvanceTablesWidget9({
  className,
  hostel,
  data,
  studentId,
  onRefresh,
}) {
  const [deleteData, setDeleteData] = useState([]);
  const [show, setShow] = useState(false);
  // console.log(data);
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
            {data.length > 0 ? (
              <table className="table table-head-custom table-vertical-center table-head-bg table-borderless">
                <thead>
                  <tr className="text-left">
                    <th style={{ minWidth: "250px" }} className="pl-7">
                      <span className="text-dark-75">Roomkeeper</span>
                    </th>
                    <th style={{ minWidth: "100px" }}>contact</th>
                    <th style={{ minWidth: "120px" }}>date</th>
                    <th style={{ minWidth: "100px" }}>time requested</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    <th style={{ minWidth: "50px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map((request) => {
                      return (
                        <tr key={request._id}>
                          <td className="pl-0 py-8">
                            <div className="d-flex align-items-center">
                              {request.roomkeeper ? (
                                <>
                                  <div className="symbol symbol-35 symbol-light mr-4">
                                    <span
                                      className="symbol-label"
                                      style={{
                                        backgroundImage: `url(${
                                          request.profileimg
                                            ? request.profileimg
                                            : toAbsoluteUrl(
                                                "/media/users/blank.png"
                                              )
                                        })`,
                                      }}
                                    ></span>
                                  </div>
                                  <div>
                                    <span
                                      href="#"
                                      className="text-dark-75 font-weight-bolder  mb-1 font-size-lg"
                                    >
                                      {request.roomkeeper
                                        ? request.roomkeeper
                                        : "No Roomkeeper Assigned"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <em className="text-muted font-weight-bold d-block">
                                  *No RoomKeeper Assigned*
                                </em>
                              )}
                            </div>
                          </td>
                          <td>
                              {request.email ? (
                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                  {request.email }
                                </span>
                              ) : (
                                <em className="text-muted font-weight-bold d-block font-size-lg">
                                  *N.A.*
                                </em>
                              )}
                            <span className="text-muted font-weight-bold">
                              {request.phone ? "+" + request.phone : ""}
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
                          <td>
                            {request.requestStatus === "Pending" ? (
                              <span className="label label-lg label-light-info label-inline">
                                {request.requestStatus}
                              </span>
                            ) : (
                              <span className="label label-lg label-light-primary label-inline">
                                {request.requestStatus}
                              </span>
                            )}
                          </td>
                          <td className="pr-0">
                            <button
                              title="Delete Clean-Request"
                              disabled={
                                request.requestStatus !== "Pending"
                                  ? true
                                  : false
                              }
                              className="btn btn-icon btn-light btn-hover-danger btn-sm "
                              onClick={() => {
                                setShow(true);
                                setDeleteData(request._id);
                              }}
                            >
                              <span className="svg-icon svg-icon-md svg-icon-danger">
                                <SVG
                                  src={toAbsoluteUrl(
                                    "/media/svg/icons/General/Trash.svg"
                                  )}
                                  title="Delete Clean-Request"
                                />
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="bgi-no-repeat text-center">
                  <img
                    src={toAbsoluteUrl("/media/svg/humans/custom-12.svg")}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                    alt="image"
                  />
                  <br />
                  <Link className="btn btn-lg btn-text-primary btn-hover-light-primary text-center font-size-xl font-weight-bold h3 m-4 p-4" to="/clean-requests">
                    <span className="svg-icon svg-icon-3x svg-icon-primary mr-0">
                      <SVG
                        className=" mr-1"
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Navigation/Plus.svg"
                        )}
                        title="Create Clean-Request"
                      />
                    </span>
                    Create Request
                  </Link>
                </div>
            )}
            </div>
            {/* end::Table */}
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Advance Table Widget 9 */}
      <StudentDeleteDialog
        data={deleteData}
        studentId={studentId}
        onRefreshTable={(refreshData) => {
          onRefresh(refreshData);
        }}
        show={show}
        onHide={() => {
          setShow(false);
        }}
      />
    </>
  );
}
