import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import MUIDataTable from "mui-datatables";
import Axios from "axios";
import { RejectDialog } from "./components/Dialogs/RejectDialog";
import AllotDialog from "./components/Dialogs/AllotDialog";
import SVG from "react-inlinesvg";
import Rating from "react-rating";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";

const headStyles = {
  color: "#B5B5C3",
  fontWeight: "600",
  fontSize: "0.9rem",
  letterSpacing: "0.1rem",
  textTransform: "uppercase",
};
const bodyStyles = {
  fontWeight: "400",
  lineHeight: "1.5",
  color: "#3f4254",
  fontSize: "13px",
  verticalAlign: "middle",
};
function AdminPage(props) {
  const [data, setData] = useState([]);
  const [rejectData, setRejectData] = useState([]);
  const [rejectShow, setRejectShow] = useState(false);
  const [allotData, setAllotData] = useState([]);
  const [allotShow, setAllotShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const hostel = useSelector(
    (state) => state.auth.user.user.hostel,
    shallowEqual
  );
  useEffect(() => {
    Axios.get(`/api/clean-requests/admin?hostel=${hostel}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setLoading(false);
      });
  }, [props, hostel]);

  const columns = [
    {
      name: "roomkeeper",
      label: "Room Keeper",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Room Keeper
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return (
            <span style={bodyStyles}>
              {value ? (
                <span className="font-weight-bold d-block">{value}</span>
              ) : tableMeta.rowData[10] === undefined ? (
                <button
                  className="btn btn-info btn-elevate btn-shadow-hover btn-md"
                  disabled={tableMeta.rowData[6] === "Rejected"}
                  onClick={() => {
                    setAllotShow(true);
                    setAllotData({
                      id: tableMeta.rowData[9],
                      room: tableMeta.rowData[1],
                      floor: tableMeta.rowData[2],
                      date: tableMeta.rowData[4],
                      time: tableMeta.rowData[5],
                    });
                  }}
                >
                  <span className="svg-icon">
                    <SVG
                      className="svg-icon svg-icon-primary"
                      src={toAbsoluteUrl("/media/svg/icons/Clothes/Cap.svg")}
                      title="Allot RoomKeeper"
                    />
                  </span>
                  Allot
                </button>
              ) : tableMeta.rowData[10].role === "admin" ? (
                <button
                  className="btn btn-info btn-elevate btn-shadow-hover btn-md"
                  disabled={tableMeta.rowData[6] === "Rejected"}
                  onClick={() => {
                    setAllotShow(true);
                    setAllotData({
                      id: tableMeta.rowData[9],
                      room: tableMeta.rowData[1],
                      floor: tableMeta.rowData[2],
                      date: tableMeta.rowData[4],
                      time: tableMeta.rowData[5],
                    });
                  }}
                >
                  <span className="svg-icon">
                    <SVG
                      className="svg-icon svg-icon-primary"
                      src={toAbsoluteUrl("/media/svg/icons/Clothes/Cap.svg")}
                      title="Allot RoomKeeper"
                    />
                  </span>
                  Allot
                </button>
              ) : (
                <button
                  className="btn btn-warning btn-elevate btn-shadow-hover btn-md"
                  disabled={tableMeta.rowData[6] === "Rejected"}
                  onClick={() => {
                    setAllotShow(true);
                    setAllotData({
                      rejectData: tableMeta.rowData[10],
                      id: tableMeta.rowData[9],
                      room: tableMeta.rowData[1],
                      floor: tableMeta.rowData[2],
                      date: tableMeta.rowData[4],
                      time: tableMeta.rowData[5],
                    });
                  }}
                >
                  <span className="svg-icon mr-0">
                    <SVG
                      className="svg-icon svg-icon-warning"
                      src={toAbsoluteUrl("/media/svg/icons/Text/Redo.svg")}
                      title="Allot RoomKeeper"
                    />
                  </span>
                  Re-Allot
                </button>
              )}
            </span>
          );
        },
      },
    },
    {
      name: "room",
      label: "Room No.",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Room No.
            </span>
          );
        },
        customBodyRender: (value) => {
          return <span style={bodyStyles}>{value}</span>;
        },
      },
    },
    {
      name: "floor",
      label: "Floor",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Floor No.
            </span>
          );
        },
        customBodyRender: (value) => {
          return <span style={bodyStyles}>{value}</span>;
        },
      },
    },
    {
      name: "rating",
      label: "Ratings",
      sortThirdClickReset: true,
      options: {
        display: "excluded",
        searchable: false,
        filter: true,
        sort: false,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Rating
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return <>{value ? value : 0}</>;
        },
      },
    },
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Date
            </span>
          );
        },
        customBodyRender: (value) => {
          return <span style={bodyStyles}>{value}</span>;
        },
      },
    },
    {
      name: "time",
      label: "Time Requested",
      options: {
        filter: false,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Time
            </span>
          );
        },
        customBodyRender: (value) => {
          return <span style={bodyStyles}>{value}</span>;
        },
      },
    },
    {
      name: "requestStatus",
      label: "Status",
      sortThirdClickReset: true,
      options: {
        filter: true,
        sort: false,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Status
            </span>
          );
        },
        customBodyRender: (value) => {
          return (
            <span style={bodyStyles}>
              {value === "Pending" && (
                <span className="label label-lg label-light-info label-inline">
                  {value}
                </span>
              )}
              {value === "Alloted" && (
                <span className="label label-lg label-light-primary label-inline">
                  {value}
                </span>
              )}
              {value === "Rejected" && (
                <span className="label label-lg label-light-danger label-inline">
                  {value}
                </span>
              )}
              {value === "Completed" && (
                <span className="label label-lg label-light-success label-inline">
                  {value}
                </span>
              )}
            </span>
          );
        },
      },
    },
    {
      name: "timeIn",
      label: "Time In",
      sortThirdClickReset: true,
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Time In
            </span>
          );
        },
        customBodyRender: (value) => {
          return (
            <span style={bodyStyles}>
              {value ? value : <strong className="text-muted">~~</strong>}
            </span>
          );
        },
      },
    },
    {
      name: "timeOut",
      label: "Time Out",
      sortThirdClickReset: true,
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Time Out
            </span>
          );
        },
        customBodyRender: (value) => {
          return (
            <span style={bodyStyles}>
              {value ? value : <strong className="text-muted">~~</strong>}
            </span>
          );
        },
      },
    },
    {
      name: "_id",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        download: false,
        empty: true,
        print: false,
        searchable: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <div>
              <button
                title="Delete Clean-Request"
                className="btn btn-light-danger font-weight-bold mr-2"
                disabled={tableMeta.rowData[6] !== "Pending" ? true : false}
                onClick={() => {
                  setRejectShow(true);
                  setRejectData({
                    value,
                    role: "admin",
                    room: tableMeta.rowData[1],
                    floor: tableMeta.rowData[2],
                    date: tableMeta.rowData[4],
                    time: tableMeta.rowData[5],
                  });
                }}
              >
                <span className="svg-icon mr-0">
                  <SVG
                    className="svg-icon svg-icon-primary mr-1"
                    src={toAbsoluteUrl("/media/svg/icons/Design/Component.svg")}
                    title="Delete Clean-Request"
                  />
                </span>
                Reject
              </button>
            </div>
          );
        },
      },
    },
    {
      name: "rejectReason",
      label: "Reject Reason",
      options: {
        filter: false,
        sort: false,
        download: false,
        display: "excluded",
        print: false,
        searchable: false,
      },
    },
  ];
  const options = {
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData) => {
      // console.log(rowData);
      return (
        <>
          {rowData[6].props.children[3] !== false &&
            (rowData[3].props.children > 0 ? (
              <>
                <td className="font-weight-bold">Ratings:</td>
                <td colSpan="8">
                  <Rating
                    initialRating={rowData[3].props.children}
                    readonly
                    emptySymbol={
                      <span className="svg-icon svg-icon-lg">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/Star.svg"
                          )}
                        />
                      </span>
                    }
                    fullSymbol={
                      <span className="svg-icon svg-icon-lg svg-icon-primary">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/Star.svg"
                          )}
                        />
                      </span>
                    }
                  />
                </td>
              </>
            ) : (
              <>
                <td className="font-weight-bold">Ratings:</td>
                <td className="text-muted">*Not Yet Rated*</td>
              </>
            ))}
          {rowData[6].props.children[2] !== false && (
            <tr>
              <td className="text-danger font-weight-bold">RejectReason:</td>
              <td colSpan="8">
                <div className="text-dark-75 font-size-md">
                  {rowData[10].message}
                </div>
              </td>
            </tr>
          )}
        </>
      );
    },
    downloadOptions: { filename: "Clean-Requests.csv", seperator: "," },
    selectableRows: "none",
    filter: true,
    elevation: 0,
    rowsPerPage: 10,
    // searchAlwaysOpen: true,
    rowHover: false,
    searchOpen: false,
    tableId: "AdminRequests",
    filterType: "dropdown",
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      body: {
        noMatch: "No Requests Made!",
        toolTip: "Sort",
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns",
      },
      selectedRows: {
        text: "Student(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
  };

  return (
    <>
      <Card className="mb-0">
        <CardHeader>
          <div className="mt-4 mb-1">
            <h3 className="card-label font-weight-bolder text-dark mb-0">
              Clean Requests List
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Manage Clean Requests of your Organization.
            </span>
          </div>
        </CardHeader>
        <CardBody style={{ zIndex: "0" }}>
          {!loading ? (
            <MUIDataTable
              title=""
              data={data}
              columns={columns}
              options={options}
              className="card card-custom shadow-none border-bottom-0 table table-head-custom table-vertical-center overflow-hidden mb-0"
            />
          ) : (
            <div className="text-center mt-4 pt-4 pb-4 mb-4 text-info">
              <CircularProgress color="inherit" size={50} />
            </div>
          )}
        </CardBody>
      </Card>
      <RejectDialog
        data={rejectData}
        hostel={hostel}
        onRefreshTable={(data) => {
          setData(data);
        }}
        show={rejectShow}
        onHide={() => {
          setRejectShow(false);
        }}
      />
      <AllotDialog
        data={allotData}
        hostel={hostel}
        onRefreshTable={(data) => {
          setData(data);
        }}
        show={allotShow}
        onHide={() => {
          setAllotShow(false);
        }}
      />
    </>
  );
}

export default AdminPage;
