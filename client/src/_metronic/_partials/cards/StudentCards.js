import React from 'react'
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from "../../_helpers";
import SVG from "react-inlinesvg";
function StudentCards(props) {
    return (
        <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card card-custom wave wave-animate-slow wave-primary mb-8 mb-lg-0">
            <div className="card-body">
              <div className="d-flex align-items-center p-5">
                <div className="mr-6">
                  <span className="svg-icon svg-icon-primary svg-icon-4x">
                    <SVG
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/Home/Broom.svg"
                      )}`}
                      alt="user svg"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <Link
                  to="/clean-requests"
                  className="d-flex flex-column text-hover-primary text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>{props.requests}</h1>CLEAN REQUESTS
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card card-custom wave wave-animate-slow wave-info mb-8 mb-lg-0">
            <div className="card-body">
              <div className="d-flex align-items-center p-5">
                <div className="mr-6">
                  <span className="svg-icon svg-icon-info svg-icon-4x">
                    <SVG
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/Home/Door-open.svg"
                      )}`}
                      alt="Door SVG"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <Link
                  to="/clean-requests"
                  className="d-flex flex-column text-hover-info text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>{props.scheduled}</h1>SCHEDULED REQUESTS
                </Link>
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
                    <SVG
                      src={`${toAbsoluteUrl(
                        "/media/svg/icons/Communication/Clipboard-check.svg"
                      )}`}
                      alt="Clipboard-Check SVG"
                    />
                  </span>
                </div>
                {/* eslint-disable-next-line */}
                <Link
                  to="/clean-requests"
                  className="d-flex flex-column text-hover-success text-dark font-weight-bold font-size-h4 mb-3"
                >
                  <h1>{props.completed}</h1>COMPLETED REQUESTS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default StudentCards
