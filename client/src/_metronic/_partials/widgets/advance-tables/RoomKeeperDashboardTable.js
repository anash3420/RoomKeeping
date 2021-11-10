/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_helpers";

export default function RoomkeeperDashboardTable({ hostel }) {
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
              <table className="table table-head-custom table-vertical-center table-head-bg table-borderless">
                <thead>
                  <tr className="text-left">
                    <th style={{ minWidth: "100px" }} className="text-center">Room</th>
                    <th style={{ minWidth: "100px" }} className="text-center">Floor</th>
                    <th style={{ minWidth: "150px" }} className="text-center">Date</th>
                    <th style={{ minWidth: "150px" }} className="text-center">time requested</th>
                    <th style={{ minWidth: "300px" }} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className = "text-center">
                    <td className="pl-0 py-8 ">
                          <span
                            href="#"
                            className="text-dark-75 font-weight-bolder  mb-1 font-size-lg"
                          >
                            A101
                          </span>
                          {/* <span className="text-muted font-weight-bold d-block">
                            HTML, JS, ReactJS
                          </span> */}
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        1
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        13 November, 2021
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        10:00 AM
                      </span>
                    </td>
                    <td className="pr-0">
                    <div className ="float-left ml-4">
                    <button
                        className="btn btn-success btn-elevate btn-shadow-hover btn-sm"
                        // onClick={() => {
                        //   setcompleteShow(true);
                        //   setcompleteData({
                        //     name,
                        //     id: tableMeta.rowData[9],
                        //     room: tableMeta.rowData[1],
                        //     floor: tableMeta.rowData[2],
                        //     date: tableMeta.rowData[4],
                        //     time: tableMeta.rowData[5],
                        //   });
                        // }}
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
                      <div className =" ">
                    <button
                title="Reject Clean-Request"
                className="btn btn-light-danger btn-sm font-weight-bold text-right"
                // disabled={tableMeta.rowData[6] !== "Alloted" ? true : false}
                // onClick={() => {
                //   setRejectShow(true);
                //   setRejectData({
                //     value,
                //     role: "roomkeeper",
                //     name,
                //     room: tableMeta.rowData[1],
                //     floor: tableMeta.rowData[2],
                //     date: tableMeta.rowData[4],
                //     time: tableMeta.rowData[5],
                //   });
                // }}
              >
                <span className="svg-icon mr-0">
                  <SVG
                    className="svg-icon svg-icon-primary mr-1"
                    src={toAbsoluteUrl("/media/svg/icons/Design/Component.svg")}
                    title="Reject Clean-Request"
                  />
                </span>
                Reject Request
              </button>
              </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Advance Table Widget 9 */}
    </>
  );
}
