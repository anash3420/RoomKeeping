/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
// import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_helpers";

export function AdvanceTablesWidget9({ className }) {
  return (
    <>
      {/* begin::Advance Table Widget 9 */}
      <div className={`card card-custom`}>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              RoomKeeping
            </span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">
              Your Pending Clean Requests.
            </span>
          </h3>
          <div className="card-toolbar">
            <Link
              to="/clean-requests"
              className="btn btn-info font-weight-bolder font-size-sm mr-3"
            >
              Send Request
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
                    <th style={{ minWidth: "250px" }} className="pl-7">
                      <span className="text-dark-75">Roomkeeper</span>
                    </th>
                    <th style={{ minWidth: "100px" }}>contact</th>
                    <th style={{ minWidth: "120px" }}>date</th>
                    <th style={{ minWidth: "100px" }}>time requested</th>
                    <th style={{ minWidth: "100px" }}>rating</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-0 py-8">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50 symbol-light mr-4">
                          {/* <span className="symbol-label">
                            <SVG
                              className="h-75 align-self-end"
                              src={toAbsoluteUrl(
                                "/media/svg/avatars/001-boy.svg"
                              )}
                            ></SVG>
                          </span> */}
                        </div>
                        <div>
                          <span
                            href="#"
                            className="text-dark-75 font-weight-bolder  mb-1 font-size-lg"
                          >
                            Brad Simmons
                          </span>
                          {/* <span className="text-muted font-weight-bold d-block">
                            HTML, JS, ReactJS
                          </span> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        anashshelat@gmail.com
                      </span>
                      <span className="text-muted font-weight-bold">
                        +1 (973) 984-1234
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        13/02/2020
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        10:00 AM
                      </span>
                    </td>
                    <td>
                      <img
                        src={`${toAbsoluteUrl("/media/logos/stars.png")}`}
                        alt="image"
                        style={{ width: "5rem" }}
                      />
                    </td>
                    <td className="pr-0">
                      <span className="label label-lg label-light-info label-inline">
                        Pending
                      </span>
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
