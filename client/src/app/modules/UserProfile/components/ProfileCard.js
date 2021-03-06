/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import Rating from "react-rating";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

export function ProfileCard() {
  const user = useSelector(({ auth }) => auth.user.user, shallowEqual);
  const role = useSelector(({ auth }) => auth.user.role, shallowEqual);
  useEffect(() => {
    return () => {};
  }, [user, role]);

  return (
    <>
      {user && (
        <div
          className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
          id="kt_profile_aside"
        >
          <div className="card card-custom card-stretch">
            {/* begin::Body */}
            <div className="card-body pt-4">
              {/* begin::Toolbar */}
              {/* <div className="d-flex justify-content-end">
                <Dropdown className="dropdown dropdown-inline" alignRight>
                  <Dropdown.Toggle
                    className="btn btn-clean btn-hover-light-primary btn-sm btn-icon cursor-pointer"
                    variant="transparent"
                    id="dropdown-toggle-top-user-profile"
                    as={DropdownCustomToggler}
                  >
                    <i className="ki ki-bold-more-hor"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                    <DropdownMenu4></DropdownMenu4>
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
              {/* end::Toolbar */}
              {/* begin::User */}
              <div className="d-flex align-items-center">
                <div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                  <div
                    className="symbol-label"
                    style={{
                      backgroundImage: `url(${
                        user.profileimg
                          ? user.profileimg
                          : toAbsoluteUrl("/media/users/blank.png")
                      })`,
                    }}
                  ></div>
                  {/* style="background-i
                  mage:url('/metronic/theme/html/demo1/dist/assets/media/users/300_21.jpg')" */}
                  <i className="symbol-badge bg-success"></i>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                  >
                    {user.name}
                  </a>
                  {role === "roomkeeper" ? (
                    user.ratings &&
                    (user.ratings !== 0 ? (
                      <div className="ml-4">
                        <Rating
                          initialRating={user.ratings.avg}
                          readonly
                          fractions={10}
                          emptySymbol={
                            <span className="svg-icon svg-icon-md">
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/General/Star.svg"
                                )}
                              />
                            </span>
                          }
                          fullSymbol={
                            <span className="svg-icon svg-icon-md svg-icon-primary">
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/General/Star.svg"
                                )}
                              />
                            </span>
                          }
                        />
                        <br />
                        <span className="text-muted font-size-sm">
                          - {user.ratings.count} Ratings
                        </span>
                      </div>
                    ) : (
                      "- N. A. -"
                    ))
                  ) : (
                    <div className="text-muted">
                      {role[0].toUpperCase() + role.slice(1)}
                    </div>
                  )}
                </div>
              </div>
              {/* end::User */}
              {/* begin::Contact */}
              <div className="py-9">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="font-weight-bold mr-2">Email:</span>
                  <span className="text-muted text-hover-primary">
                    {user.email}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="font-weight-bold mr-2">Phone:</span>
                  <span className="text-muted">
                    {user.phone ? user.phone : "- N. A. -"}
                  </span>
                </div>
                {role === "student" && (
                  <>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">
                        Room Number:
                      </span>
                      <span className="text-muted">{user.room}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="font-weight-bold mr-2">Floor:</span>
                      <span className="text-muted">{user.floor}</span>
                    </div>
                  </>
                )}
                {/* To-Do */}
                {role === "roomkeeper" && (
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="font-weight-bold mr-2">Ratings:</span>
                    { user.ratings && (user.ratings !== 0 ? (
                      <div>
                        <span className="text-muted ml-4 pl-4 mb-4 font-size-sm">
                          <strong className="font-size-lg">
                            {user.ratings.avg}
                          </strong>
                          <span className="svg-icon svg-icon-md svg-icon-primary align-top">
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/General/Star.svg"
                              )}
                            />
                          </span>{" "}
                          From{" "}
                          <strong className="font-size-lg">
                            {user.ratings.count}
                          </strong>{" "}
                          Ratings!
                        </span>
                      </div>
                    ) : (
                      "- N. A. -"
                    ))}
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="font-weight-bold mr-2">Organization:</span>
                  <span className="text-muted">{user.hostel}</span>
                </div>
              </div>
              {/* end::Contact */}
              {/* begin::Nav */}
              <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                <div className="navi-item mb-2">
                  <NavLink
                    to="/user-profile/personal-information"
                    className="navi-link py-4"
                    activeClassName="active"
                  >
                    <span className="navi-icon mr-2">
                      <span className="svg-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/User.svg"
                          )}
                        ></SVG>{" "}
                      </span>
                    </span>
                    <span className="navi-text font-size-lg">
                      Personal Information
                    </span>
                  </NavLink>
                </div>
                <div className="navi-item mb-2">
                  <NavLink
                    to="/user-profile/change-password"
                    className="navi-link py-4"
                    activeClassName="active"
                  >
                    <span className="navi-icon mr-2">
                      <span className="svg-icon">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Communication/Shield-user.svg"
                          )}
                        ></SVG>{" "}
                      </span>
                    </span>
                    <span className="navi-text font-size-lg">
                      Change Password
                    </span>
                  </NavLink>
                </div>
              </div>
              {/* end::Nav */}
            </div>
            {/* end::Body */}
          </div>
        </div>
      )}
    </>
  );
}
