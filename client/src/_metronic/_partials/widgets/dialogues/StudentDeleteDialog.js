import Axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
export default function StudentDeleteDialog({
  data,
  onRefreshTable,
  show,
  onHide,
  studentId,
}) {
  const [isLoading, setLoading] = useState(false);
  const [isDeleted, setisDeleted] = useState(false);
  const deleteRequest = () => {
    // server request for deleting request by id
    setLoading(true);
    Axios.post(`/api/deleteRequest`, { id: data })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          setisDeleted(true);
          getRequests();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getRequests = () => {
    Axios.get(`/api/student/dashboard?id=${studentId}`)
      .then((response) => {
        onRefreshTable(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal show={show} onHide={onHide} aria-labelledby="Delete-Modal">
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      {!isDeleted && (
        <Modal.Header closeButton>
          <Modal.Title id="Delete-Modal">Delete Clean-Request</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {!isDeleted ? (
          isLoading ? (
            <span>Request is deleting...</span>
          ) : (
            <span>Are you sure?</span>
          )
        ) : (
          <>
            <img
              src={`${toAbsoluteUrl("/media/svg/illustrations/features.svg")}`}
              alt="user svg"
            />
            <h2 className="text-success font-weight-bold text-center">
              Successfully Deleted!
            </h2>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {isDeleted ? (
          <>
            <button
              type="button"
              onClick={() => {
                onHide();
                setTimeout(() => {
                  setisDeleted(false);
                }, 500);
              }}
              className="btn btn-success btn-shadow-hover font-weight-bolder w-100 py-3 text-center"
            >
              Confirm
            </button>
          </>
        ) : (
          !isLoading && (
            <div>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="button"
                onClick={deleteRequest}
                className="btn btn-primary btn-elevate"
              >
                Delete
              </button>
            </div>
          )
        )}
      </Modal.Footer>
    </Modal>
  );
}
