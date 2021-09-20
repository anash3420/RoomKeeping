import React from "react";
import { toAbsoluteUrl } from "../../_helpers";
export function AdminDashboard() {
  return (
    <>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0">
            <div className="card-body">
              <div className="d-flex align-items-center p-5">
                <div className="mr-6">
                  <span className="svg-icon svg-icon-primary svg-icon-4x">
                    <img
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/General/User.svg"
                      )}`}
                      alt="user svg"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <a
                  href="#"
                  className="d-flex flex-column text-hover-primary text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>4</h1>Students Registered
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card card-custom wave wave-animate-slow wave-info mb-8 mb-lg-0">
            <div className="card-body">
              <div className="d-flex align-items-center p-5">
                <div className="mr-6">
                  <span className="svg-icon svg-icon-warning svg-icon-4x">
                    <img
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/Home/Armchair.svg"
                      )}`}
                      alt="Armchair SVG"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <a
                  href="#"
                  className="d-flex flex-column text-hover-info text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>2</h1>Roomkeepers Registered
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card card-custom wave wave-animate-slow wave-success mb-8 mb-lg-0">
            <div className="card-body">
              <div className="d-flex align-items-center p-5">
                <div className="mr-6">
                  <span className="svg-icon svg-icon-success svg-icon-4x">
                    <img
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/Communication/Clipboard-check.svg"
                      )}`}
                      alt="Clipboard-Check SVG"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <a
                  href="#"
                  className="d-flex flex-column text-hover-success text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>18</h1>Requests Completed
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
