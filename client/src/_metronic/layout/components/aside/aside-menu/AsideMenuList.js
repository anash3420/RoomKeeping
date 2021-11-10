/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };
  const role = useSelector(({ auth }) => auth.user.role);
  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* -------------------------------------------------------General----------------------------------------------------- */}
        {/*begin::Dashboard*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to={`/dashboard/${role}`}>
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::Dashboard*/}
        {/*begin::Clean Requests*/}
        <li
          className={`menu-item ${getMenuItemActive("/clean-requests", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/clean-requests">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Broom.svg")} />
            </span>
            <span className="menu-text">Clean Requests</span>
          </NavLink>
        </li>
        {/*end::Clean Requests*/}
        {/*begin::User Profile*/}
        <li
          className={`menu-item ${getMenuItemActive("/user-profile", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user-profile">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Add-user.svg"
                )}
              />
            </span>
            <span className="menu-text">User Profile</span>
          </NavLink>
        </li>
        {/*end::User Profile*/}

        {/* ------------------------------------------------Feedback------------------------------------------------------------ */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">Feedback</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}
        {role === "student" && (
          <>
            {/*begin::Feedback*/}
            <li
              className={`menu-item ${getMenuItemActive("/student/ratings", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/student/ratings">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Chat4.svg"
                    )}
                  />
                </span>
                <span className="menu-text">Feedback</span>
              </NavLink>
            </li>
            {/*end::Feedback*/}
          </>
        )}
        {(role === "admin" || role === "roomkeeper") && (
          <>
            {role === "roomkeeper" && (
              <>
                {/*begin::ratings*/}
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/roomkeeper/ratings",
                    false
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/roomkeeper/ratings">
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/General/Thunder.svg"
                        )}
                      />
                    </span>
                    <span className="menu-text">Ratings</span>
                  </NavLink>
                </li>
                {/*end::ratings*/}
              </>
            )}
            {/*begin::Complaints*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/complaints",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/complaints">
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Spy.svg")} />
                </span>
                <span className="menu-text">Complaints</span>
              </NavLink>
            </li>
            {/*end::Complaints*/}

            {/*begin::Suggestions*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/suggestions",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/suggestions">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Box1.svg")}
                  />
                </span>
                <span className="menu-text">Suggestions</span>
              </NavLink>
            </li>
            {/*end::Suggestions*/}
          </>
        )}

        {/* --------------------------------------------------Registration-------------------------------------------------------- */}
        {/* begin::section */}
        {role === "admin" && (
          <>
            <li className="menu-section ">
              <h4 className="menu-text">Manage Users</h4>
              <i className="menu-icon flaticon-more-v2"></i>
            </li>
            {/* end:: section */}

            {/*begin::RoomKeeper*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/manage/roomkeeper",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/manage/roomkeeper">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Chair2.svg")}
                  />
                </span>
                <span className="menu-text">RoomKeepers</span>
              </NavLink>
            </li>
            {/*end::Roomkeeper*/}

            {/*begin::Student*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/manage/student",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/manage/student">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")}
                  />
                </span>
                <span className="menu-text">Students</span>
              </NavLink>
            </li>
            {/*end::Student*/}
          </>
        )}

        {/* --------------------------------------------------Custom------------------------------------------------------------- */}
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">Custom</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/*begin::Layout Builder*/}
        <li
          className={`menu-item ${getMenuItemActive("/builder", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/builder">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
            </span>
            <span className="menu-text">Layout Builder</span>
          </NavLink>
        </li>
        {/*end::Layout Builder*/}

        {/*begin::Sign Out*/}
        <li
          className={`menu-item ${getMenuItemActive("/logout", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/logout">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Sign-out.svg")}
              />
            </span>
            <span className="menu-text">Sign Out</span>
          </NavLink>
        </li>
        {/*end::Sign Out*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
