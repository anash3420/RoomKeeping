import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import Axios from "axios";

function RegisterStudent() {
    // Fields
  const [loading, setloading] = useState(false);
  const [isError, setisError] = useState(false);
  const [errmsg, setErrmsg] = useState("");
  const [registered, setRegistered] = useState(false);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const role = user.role;
  const hostel = user.user.hostel;
  useEffect(() => {}, [user]);
  // Methods
  const saveUser = (values, setStatus, setSubmitting) => {
    setloading(true);
    setisError(false);
    // user for update preparation
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      Axios.post("/api/register/Student", {
        ...values,
        hostel: hostel,
        role: role,
      })
        .then(function(response) {
          setRegistered(false);
          if (response.status === 203) {
            setStatus("User Already Registered.");
            setErrmsg(response.data);
            setisError(true);
          } else if (response.status === 200) {
            setRegistered(true);
            formik.handleReset();
          }
          setloading(false);
        })
        .catch(function(error) {
          console.log(error);
          setloading(false);
          setSubmitting(false);
          setStatus(error);
          setisError(true);
        });
    }, 1000);
  };
  // UI Helpers
  const initialValues = {
    fullname: "",
    email: "",
    password: "",
    room: "",
    floor: "",
  };
  const Schema = Yup.object().shape({
    fullname: Yup.string()
      .min(5)
      .max(255)
      .required("Name is required"),
    password: Yup.string()
      .min(3)
      .max(50)
      .required("New Password is required"),
    email: Yup.string()
      .required("E-mail is required")
      .email(),
    room: Yup.string().required("Room Number is Required"),
    floor: Yup.number().integer().required("Floor is Required"),
  });
  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      formik.setValues({
        fullname: initialValues.fullname,
        email: initialValues.email,
        password: initialValues.password,
        room: initialValues.room,
        floor: initialValues.floor,
      });
    },
  });

  return (
    <form
      className="card card-custom"
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
    >
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            Register Student
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            Registering the Student for your organization.
          </span>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        <div className="card-body">
          {/* begin::Alert */}
          {isError && (
            <div
              className="alert alert-custom alert-light-danger fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                  ></SVG>{" "}
                </span>
              </div>
              <div className="alert-text font-weight-bold">{errmsg}</div>
              <div className="alert-close" onClick={() => setisError(false)}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i className="ki ki-close"></i>
                  </span>
                </button>
              </div>
            </div>
          )}
          {registered && (
            <div
              className="alert alert-custom alert-light-success fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-success">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Done-circle.svg")}
                  ></SVG>{" "}
                </span>
              </div>
              <div className="alert-text font-weight-bold">
                Student Registered.
              </div>
              <div className="alert-close" onClick={() => setRegistered(false)}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i className="ki ki-close"></i>
                  </span>
                </button>
              </div>
            </div>
          )}
          {/* end::Alert */}
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Full Name
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="Full Name"
                className={`form-control form-control-lg form-control-solid mb-2 ${getInputClasses(
                  "fullname"
                )}`}
                name="fullname"
                {...formik.getFieldProps("fullname")}
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <div className="invalid-feedback">{formik.errors.fullname}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Room Details
            </label>
            <div className="col-lg-3 col-xl-3">
              <input
                type="text"
                placeholder="Room Number"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "room"
                )}`}
                name="room"
                autoComplete="off"
                {...formik.getFieldProps("room")}
              />
              {formik.touched.room && formik.errors.room ? (
                <div className="invalid-feedback">{formik.errors.room}</div>
              ) : null}
            </div>
            <div className="col-lg-3 col-xl-3">
              <input
                type="text"
                placeholder="Floor"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "floor"
                )}`}
                name="floor"
                autoComplete="off"
                {...formik.getFieldProps("floor")}
              />
              {formik.touched.floor && formik.errors.floor ? (
                <div className="invalid-feedback">{formik.errors.floor}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              E-mail
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="E Mail"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "email"
                )}`}
                name="email"
                autoComplete="off"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Password
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="password"
                placeholder="Password"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "password"
                )}`}
                name="password"
                autoComplete="off"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="invalid-feedback">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert"></label>
            <div className="col-lg-9 col-xl-6">
              <button
                type="submit"
                className="btn btn-info font-weight-bold px-9 py-4 my-3"
                disabled={
                  formik.isSubmitting || (formik.touched && !formik.isValid)
                }
              >
                Register
                {formik.isSubmitting}
              </button>
              <button
                type="reset"
                className="btn btn-secondary font-weight-bold px-9 py-4 my-3 ml-5"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegisterStudent
