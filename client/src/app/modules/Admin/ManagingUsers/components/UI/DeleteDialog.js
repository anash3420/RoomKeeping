import Axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
export function DeleteDialog({
  data,
  onRefreshTable,
  hostel,
  role,
  show,
  onHide,
  action,
}) {
  const [isLoading, setLoading] = useState(false);
  const [isDeleted, setisDeleted] = useState(false);
  const deleteUsers = () => {
    // server request for deleting customer by selected ids
    setLoading(true);
    setTimeout(() => {
      if (action === "all") {
        Axios.post(`/api/deleteAllUsers?hostel=${hostel}&role=${role}`)
          .then(() => {
            setLoading(false);
            setisDeleted(true);
            getUsers();
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else if (action === "selected") {
        Axios.post(`/api/deleteUsers?hostel=${hostel}&role=${role}`, {
          data: data,
        })
          .then((res) => {
            setLoading(false);
            setisDeleted(true);
            getUsers();
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      } else if (action === "single") {
        Axios.post(`/api/deleteUsers?hostel=${hostel}&role=${role}`, {
          email: data,
        })
          .then((res) => {
            setLoading(false);
            setisDeleted(true);
            getUsers();
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    }, 1000);
  };

  const getUsers = () => {
    Axios.get(`/api/users?hostel=${hostel}&role=${role}`)
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
          <Modal.Title id="Delete-Modal">
            {role.charAt(0).toUpperCase() + role.slice(1)} Delete
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {!isDeleted ? (
          isLoading ? (
            <span>
              {role.charAt(0).toUpperCase() + role.slice(1)} are deleting...
            </span>
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
              onClick={deleteUsers}
              className="btn btn-primary btn-elevate"
            >
              Delete
            </button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}
