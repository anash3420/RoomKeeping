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
        {role === "admin" && (
          <>
            <li className="menu-section ">
              <h4 className="menu-text">Feedback</h4>
              <i className="menu-icon flaticon-more-v2"></i>
            </li>
            {/* end:: section */}

            {/*begin::Complaints*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/admin/complaints",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/admin/complaints">
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Spy.svg")} />
                </span>
                <span className="menu-text">Complaints</span>
              </NavLink>
            </li>
            {/*end::Roomkeeper*/}

            {/*begin::Student*/}
            <li
              className={`menu-item ${getMenuItemActive(
                "/admin/suggestions",
                false
              )}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/admin/suggestions">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Box1.svg")}
                  />
                </span>
                <span className="menu-text">Suggestions</span>
              </NavLink>
            </li>
            {/*end::Student*/}

            {/* --------------------------------------------------Registration-------------------------------------------------------- */}
            {/* begin::section */}
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

        {/* Error Pages */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/error",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/error">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Code/Error-circle.svg")}
              />
            </span>
            <span className="menu-text">Error Pages</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Error Pages</span>
                </span>
              </li>

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v1")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v1">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page - 1</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v2")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v2">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page -2</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v3")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v3">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page - 3</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v4")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v4">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page - 4</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v5")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v5">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page - 5</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive("/error/error-v6")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/error/error-v6">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Error Page - 6</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
