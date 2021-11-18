import Axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextareaAutosize } from "@material-ui/core";
export function RejectDialog({ data, onRefreshTable, show, onHide, hostel, roomKeeperId }) {
  const [isLoading, setLoading] = useState(false);
  const rejectRequest = (values) => {
    // server request for deleting request by id
    setLoading(true);
    Axios.post(`/api/rejectRequest`, {
      role: data.role,
      name: data.name,
      id: data.id,
      message: values.message,
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
        setTimeout(() => {
          getRequests();
          onHide();
        }, 1000);
      });
  };
  const getRequests = () => {
    if (data.role === "admin") {
      Axios.get(`/api/admin/dashboard?hostel=${hostel}`)
        .then((response) => {
          onRefreshTable(response.data);
          onHide();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (data.role === "roomkeeper") {
      Axios.get(`/api/roomkeeper/dashboard?id=${roomKeeperId}`)
        .then((response) => {
          onRefreshTable(response.data);
          onHide();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const initialValues = {
    message: "",
  };
  const Schema = Yup.object().shape({
    message: Yup.string().required("Reason is Required!"),
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
      rejectRequest(values);
    },
    onReset: () => {
      formik.setValues({
        message: initialValues.message,
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
          <Modal.Title id="Delete-Modal">Reject Clean-Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <span>Rejecting Request...</span>
          ) : (
            <>
              <div className="form-group row">
                <label className="col-xl-1 col-lg-1 col-form-label text-alert">
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
                <label className="col-xl-1 col-lg-1 col-form-label text-alert">
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
                <label className="col-xl-1 col-lg-1 col-form-label text-alert">
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
                <label className="col-xl-1 col-lg-1 col-form-label text-alert">
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
                <label className="col-xl-12 col-lg-12 col-form-label text-alert">
                  Reason for Rejection{" "}
                  <strong className="text-danger">*</strong>
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isLoading && (
            <div>
              <button
                type="reset"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button type="submit" className="btn btn-danger btn-elevate">
                Confirm
              </button>
            </div>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
}
