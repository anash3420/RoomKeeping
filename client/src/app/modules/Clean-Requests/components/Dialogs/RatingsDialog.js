import Axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextareaAutosize } from "@material-ui/core";
import Rating from "react-rating";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";

export function RatingsDialog({
  data,
  onRefreshTable,
  show,
  onHide,
  studentId,
}) {
  const [isLoading, setLoading] = useState(false);
  const [rating, setRating] = useState(2);
  const rateRequest = (values) => {
    setLoading(true);
    Axios.post(`/api/ratings`, {
      id: data.id,
      message: values.message,
      rating: rating,
      suggestions: values.suggestions,
      complaints: values.complaints,
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
        formik.resetForm();
        getRequests();
        setRating(2);
        setTimeout(() => {
          onHide();
        }, 1000);
      });
  };
  const getRequests = () => {
    Axios.get(`/api/clean-requests/student?id=${studentId}`)
      .then((response) => {
        onRefreshTable(response.data);
        onHide();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const initialValues = {
    message: "",
    suggestions: "",
    complaints: "",
  };
  const Schema = Yup.object().shape({
    message: Yup.string().max(100, "Message should be of at max 100 chars!"),
    suggestions: Yup.string().max(
      150,
      "Suggestion should be of at max 150 chars!"
    ),
    complaints: Yup.string().max(
      150,
      "Complaint should be of at max 150 chars!"
    ),
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
      rateRequest(values);
    },
    onReset: () => {
      formik.setValues({
        message: "",
        suggestions: "",
        complaints: "",
      });
    },
  });
  return (
    <Modal size="lg" show={show} onHide={onHide} aria-labelledby="Reject-Modal">
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}

      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Modal.Header closeButton>
          <Modal.Title id="Delete-Modal">Rate Clean-Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <span>Rating in Progress...</span>
          ) : (
            <>
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
                  Time- In:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.timeIn}
                    disabled
                  />
                </div>
                <div className="col-lg-2 col-xl-2 "></div>
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Time-Out:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.timeOut}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group row text-center">
                <div className="col-lg-3 col-xl-3 text-left mt-4 text-dark-65">
                  <h4>Rating:</h4>
                </div>
                <div className="col-lg-6 col-xl-6 ">
                  <Rating
                    initialRating={rating}
                    emptySymbol={
                      <span className="svg-icon svg-icon-4x">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/Star.svg"
                          )}
                        />
                      </span>
                    }
                    fullSymbol={
                      <span className="svg-icon svg-icon-4x svg-icon-primary">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/Star.svg"
                          )}
                        />
                      </span>
                    }
                    onChange={(value) => setRating(value)}
                  />
                </div>
                <div className="col-lg-3 col-xl-3 "></div>
              </div>
              <div className="form-group row">
                <label className="col-xl-2 col-lg-2 col-form-label text-alert">
                  Message:
                </label>
                <div className="col-lg-10 col-xl-10 ">
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
                    <div className="invalid-feedback">
                      {formik.errors.message}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="form-group row mb-0">
                <label className="col-xl-6 col-lg-6 col-form-label text-warning">
                  Suggestions:
                </label>
                <label className="col-xl-6 col-lg-6 col-form-label text-danger">
                  Complaints:
                </label>
              </div>
              <div className="form-group row">
                <div className="col-lg-6 col-xl-6 ">
                  <TextareaAutosize
                    placeholder="We'd love to hear some suggestions!"
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "suggestions"
                    )}`}
                    name="suggestions"
                    autoComplete="off"
                    {...formik.getFieldProps("suggestions")}
                  />
                  {formik.touched.suggestions && formik.errors.suggestions ? (
                    <div className="invalid-feedback">
                      {formik.errors.suggestions}
                    </div>
                  ) : null}
                </div>
                <div className="col-lg-6 col-xl-6 ">
                  <TextareaAutosize
                    placeholder="Got Complaints for RoomKeeping Service?"
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                      "complaints"
                    )}`}
                    name="complaints"
                    autoComplete="off"
                    {...formik.getFieldProps("complaints")}
                  />
                  {formik.touched.complaints && formik.errors.complaints ? (
                    <div className="invalid-feedback">
                      {formik.errors.complaints}
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          {!isLoading && (<div>
            <button
              type="reset"
              onClick={onHide}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
            <button type="submit" className="btn btn-info btn-elevate">
              Rate
            </button>
          </div>)}
        </Modal.Footer>
      </form>
    </Modal>
  );
}
