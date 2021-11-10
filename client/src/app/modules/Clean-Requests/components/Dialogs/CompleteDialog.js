import Axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";

export default function CompleteDialog({
  data,
  onRefreshTable,
  show,
  onHide,
  hostel,
}) {
    const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const completeRequest = (values) => {
    const timeIn = moment(values.timeIn).format("LT");
    const timeOut = moment(values.timeOut).format("LT");
    // server request for deleting request by id
    setLoading(true);
    Axios.post(`/api/completeRequest`, {
      id: data.id,
      timeIn,
      timeOut,
    })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .then(() => {
        getRequests();
        setTimeout(() => {
          onHide();
        }, 1000);
      });
  };
  const getRequests = () => {
    Axios.get(
      `/api/clean-requests/roomkeeper?hostel=${hostel}&name=${data.name}`
    )
      .then((response) => {
        onRefreshTable(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const initialValues = {
    timeIn: "",
    timeOut: "",
  };
  const Schema = Yup.object().shape({
    timeIn: Yup.string().required("Time-In is required"),
    timeOut: Yup.string().required("Time-Out is required"),
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
    onSubmit: (values) => {
      completeRequest(values);
    },
    onReset: () => {
      formik.setValues({
        timeIn: initialValues.timeIn,
        timeOut: initialValues.timeOut,
      });
    },
  });
  return (
    <Modal size="lg" show={show} onHide={onHide} aria-labelledby="Reject-Modal">
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        {/*begin::Loading*/}
        {isLoading && <ModalProgressBar />}
        {/*end::Loading*/}
        <Modal.Header closeButton>
          <Modal.Title id="Delete-Modal">
            Complete Clean Request
            <Typography variant="subtitle1" display="block" gutterBottom>
              Mark status of your clean request as complete.
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <span>Updating Status...</span>
          ) : (
            <>
              <div className="form-group row">
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Room:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.room}
                    disabled
                  />
                </div>
                <div className="col-lg-2 col-xl-2 "></div>
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Floor:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.floor}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Date:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.date}
                    disabled
                  />
                </div>
                <div className="col-lg-2 col-xl-2 "></div>
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Time:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.time}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Time-In:
                </label>
                <div className="col-lg-3 col-xl-3 mb-4">
                  <DatePicker
                    placeholderText="Time-In"
                    dateFormat="h:mm aa"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={5}
                    timeClassName={(time) => {
                      return time.getHours() >= 12
                        ? "text-success"
                        : time.getHours() >= 6 && "text-primary";
                    }}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "timeIn"
                    )}`}
                    style={{ width: "100%" }}
                    {...formik.getFieldProps("timeIn")}
                    selected={formik.values.timeIn}
                    onChange={(val) => {
                      formik.setFieldValue("timeIn", val);
                    }}
                  />
                  {formik.touched.timeIn && formik.errors.timeIn ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.timeIn}
                    </div>
                  ) : null}
                </div>
                <div className="col-lg-2 col-xl-2 "></div>
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Time-Out:
                </label>
                <div className="col-lg-3 col-xl-3 mb-4">
                  <DatePicker
                    placeholderText="Time-Out"
                    dateFormat="h:mm aa"
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={5}
                    timeClassName={(time) => {
                      return time.getHours() >= 12
                        ? "text-success"
                        : time.getHours() >= 6 && "text-primary";
                    }}
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "timeOut"
                    )}`}
                    style={{ width: "100%" }}
                    {...formik.getFieldProps("timeOut")}
                    selected={formik.values.timeOut}
                    onChange={(val) => {
                      formik.setFieldValue("timeOut", val);
                      formik.values.timeIn >= val && setError(true);
                      formik.values.timeIn < val && setError(false);
                    }}
                  />
                  {error && <div className="invalid-feedback d-block">Time-In should be greater than Time-Out</div>}
                  {formik.touched.timeOut && formik.errors.timeOut ? (
                    <div className="invalid-feedback d-block">
                      {formik.errors.timeOut}
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div>
            {!isLoading && (
              <>
                <button
                  type="reset"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="submit"
                  className="btn btn-success btn-elevate px-4"
                >
                  {"  "}Confirm{"  "}
                </button>
              </>
            )}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
