import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));

export default function AllotDialog({
  data,
  onRefreshTable,
  show,
  onHide,
  hostel,
}) {
  const [isLoading, setLoading] = useState(false);
  const [roomKeepersList, setRoomKeepersList] = useState([]);
  const [roomKeeper, setRoomKeeper] = useState("");
  const [scheduleShow, setScheduleShow] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    Axios.get(`/api/allotRequest?hostel=${hostel}`)
      .then((res) => {
        setRoomKeepersList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [hostel]);
  const allotRequest = (values) => {
    // server request for deleting request by id
    setLoading(true);
    Axios.post(`/api/allotRequest`, {
      id: data.id,
      roomKeeper: roomKeeper,
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
        setRoomKeeper("");
        setScheduleShow(false);
        setTimeout(() => {
          getRequests();
          onHide();
        }, 1000);
      });
  };
  const getRequests = () => {
    Axios.get(`/api/clean-requests/admin?hostel=${hostel}`)
      .then((response) => {
        onRefreshTable(response.data);
        onHide();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const initialValues = {
    roomKeeper: "",
  };
  const Schema = Yup.object().shape({
    roomKeeper: Yup.string().required("RoomKeeper Name is Required!"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: (values) => {
      allotRequest(values);
    },
    onReset: () => {
      setRoomKeeper("");
      setScheduleShow(false);
      setScheduleList([]);
      formik.setValues({
        roomKeeper: initialValues.roomKeeper,
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
          <Modal.Title id="Delete-Modal">Allot RoomKeeper<Typography variant="subtitle1" display="block" gutterBottom>Allot RoomKeeper for the given clean-request.</Typography></Modal.Title>
          
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <span>Alloting RoomKeeper...</span>
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
                <label className="col-xl-3 col-lg-3 col-form-label text-alert">
                  RoomKeeper Name
                  <strong className="text-danger">*</strong>
                </label>
                <div className="col-lg-7 col-xl-7 ">
                  <Select
                    style={{ width: "100%" }}
                    id="nameLabel"
                    name="roomKeeper"
                    value={roomKeeper}
                    label="Age"
                    onChange={(event) => {
                      setRoomKeeper(event.target.value);
                      Axios.get(
                        `/api/schedule?roomKeeper=${event.target.value}&date=${data.date}`
                      )
                        .then((res) => {
                          setScheduleShow(true);
                          setScheduleList(res.data);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    {roomKeepersList.map((roomKeeper) => {
                      return (
                        <MenuItem value={roomKeeper.name} key={roomKeeper._id}>
                          {roomKeeper.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {formik.touched.roomKeeper && formik.errors.roomKeeper ? (
                    <div className="invalid-feedback">
                      {formik.errors.roomKeeper}
                    </div>
                  ) : null}
                </div>
              </div>
              {data.rejectData !== undefined && (<div className="form-group row">
                <label className="col-xl-2 col-lg-2 col-form-label text-danger">
                  Rejected By:
                </label>
                <div className="col-lg-3 col-xl-3 ">
                  <input
                    type="text"
                    className="form-control"
                    value={data.rejectData.name}
                    disabled
                  />
                </div>
                <label className="col-xl-1 col-lg-1 col-form-label text-danger">
                  Reason:
                </label>
                <div className="col-lg-4 col-xl-4 ">
                  <input
                    type="textarea"
                    className="form-control"
                    value={data.rejectData.message}
                    disabled
                  />
                  </div>
              </div>)}
                    
              <div style={{maxHeight: "275px",minHeight: "200px"}}>
              {scheduleShow && (
                <>
                  <h5 className="text-dark">
                    {roomKeeper}'s Schedule on {data.date}:
                  </h5>
                    <Paper className={classes.root} >
                      <Table >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell align="center">Room No.</StyledTableCell>
                            <StyledTableCell align="center">
                              Floor
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Time Requested
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody >
                          {scheduleList.length === 0 ? (
                              <div className="text-center w-100" style={{margin: "25px 75% 25px 75%"}}><Typography variant="button" display="block" gutterBottom>No Alloted Requests!</Typography></div>
                          ) : (
                            scheduleList.map((row) => (
                              <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row" align="center">
                                  {row.room}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.floor}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.time}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Paper>
                </>
              )}
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
                  type="button"
                  className="btn btn-info btn-elevate px-4"
                  disabled={roomKeeper === ""}
                  onClick={allotRequest}
                >
                  {"  "}Allot{"  "}
                </button>
              </>
            )}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
