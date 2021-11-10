import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import Axios from "axios";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import { TextareaAutosize } from "@material-ui/core";
import moment from "moment";
function StudentRequestForm(props) {
  // Fields
  const [loading, setloading] = useState(false);
  const [isError, setisError] = useState(false);
  const [errmsg, setErrmsg] = useState("");
  const [created, setCreated] = useState(false);
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const studentid = user.user._id;
  const hostel = user.user.hostel;
  const room = user.user.room;
  const floor = user.user.floor;
  useEffect(() => {}, [user]);
  // Methods
  const createRequest = (values, setStatus, setSubmitting) => {
    const date = moment(values.date).format("Do MMMM, yyyy")
    const time = moment(values.time).format("LT");
    setloading(true);
    setisError(false);
    // user for update preparation
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      Axios.post("/api/clean-request/create", {
        date,
        time,
        studentid,
        hostel,
        room,
        floor,
        message: values.message,
      })
        .then(function(response) {
          setCreated(false);
          if (response.status === 203) {
            setStatus(response.data);
            setErrmsg(response.data);
            setisError(true);
          } else if (response.status === 200) {
            setCreated(true);
            formik.handleReset();
            props.onCreate();
            // setTimeout(() => {setCreated(false)}, 5000);
          }
          setloading(false);
        })
        .catch(function(error) {
          console.log(error);
          setloading(false);
          setSubmitting(false);
          setStatus("An Error Occured");
          setisError(true);
        });
    }, 1000);
  };
  // UI Helpers
  const initialValues = {
    date: "",
    time: "",
    message: "",
  };
  const Schema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
    message: Yup.string().max(100),
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
      createRequest(values, setStatus, setSubmitting);
    },
    onReset: () => {
      formik.setValues({
        date: initialValues.date,
        time: initialValues.time,
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
            Create Request
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            Creating the Clean Request for your Room.
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
          {created && (
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
                Request Successflly Created.
              </div>
              <div className="alert-close" onClick={() => setCreated(false)}>
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
              Schedule Clean Request:
            </label>

            <div className="col-lg-3 col-xl-3 col-md-4 col-sm-6 mb-4">
              <DatePicker
                placeholderText="Date"
                dateFormat="dd MMMM, yyyy"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "date"
                )}`}
                style={{ width: "100%" }}
                {...formik.getFieldProps("date")}
                selected={formik.values.date}
                onChange={(val) => {
                  formik.setFieldValue("date", val);
                }}
                minDate={new Date().setDate(new Date().getDate() + 1)}
              />
              {formik.touched.date && formik.errors.date ? (
                <div className="invalid-feedback">{formik.errors.date}</div>
              ) : null}
            </div>
            <div className="col-lg-3 col-xl-3 col-md-4 col-sm-6 mb-4">
              <DatePicker
                placeholderText="Time"
                dateFormat="h:mm aa"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeClassName={(time) => {
                  return time.getHours() >= 12
                    ? "text-success"
                    : time.getHours() >= 6 && "text-primary";
                }}
                excludeTimes={[
                  setHours(setMinutes(new Date(), 0), 0),
                  setHours(setMinutes(new Date(), 0), 1),
                  setHours(setMinutes(new Date(), 0), 2),
                  setHours(setMinutes(new Date(), 0), 3),
                  setHours(setMinutes(new Date(), 0), 4),
                  setHours(setMinutes(new Date(), 0), 5),
                  setHours(setMinutes(new Date(), 30), 0),
                  setHours(setMinutes(new Date(), 30), 1),
                  setHours(setMinutes(new Date(), 30), 2),
                  setHours(setMinutes(new Date(), 30), 3),
                  setHours(setMinutes(new Date(), 30), 4),
                  setHours(setMinutes(new Date(), 30), 5),
                ]}
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "time"
                )}`}
                style={{ width: "100%" }}
                {...formik.getFieldProps("time")}
                selected={formik.values.time}
                onChange={(val) => {
                  formik.setFieldValue("time", val);
                }}
              />
              {formik.touched.time && formik.errors.time ? (
                <div className="invalid-feedback">{formik.errors.time}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Additional Instructions(if any):
            </label>
            <div className="col-lg-6 col-xl-6 ">
              <TextareaAutosize
                placeholder="Message"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "message"
                )}`}
                name="message"
                autoComplete="off"
                {...formik.getFieldProps("message")}
              />
              {formik.touched.message && formik.errors.message ? (
                <div className="invalid-feedback">{formik.errors.message}</div>
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
                Create
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

export default StudentRequestForm;
