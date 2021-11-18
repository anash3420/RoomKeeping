import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import MUIDataTable from "mui-datatables";
import Axios from "axios";
import { RejectDialog } from "./components/Dialogs/RejectDialog";
import SVG from "react-inlinesvg";
import Rating from "react-rating";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import CompleteDialog from "./components/Dialogs/CompleteDialog";

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
function RoomKeeperPage(props) {
  const [data, setData] = useState([]);
  const [rejectData, setRejectData] = useState([]);
  const [rejectShow, setRejectShow] = useState(false);
  const [completeData, setcompleteData] = useState([]);
  const [completeShow, setcompleteShow] = useState(false);
  const user = useSelector((state) => state.auth.user.user, shallowEqual);
  const hostel = user.hostel;
  const name = user.name;
  useEffect(() => {
    Axios.get(`/api/clean-requests/roomKeeper?hostel=${hostel}&name=${name}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props, hostel, name]);

  const columns = [
    {
      name: "_id",
      label: "Room Keeper",
      options: {
        filter: false,
        sort: false,
        download: false,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Rating
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return (
            <span style={bodyStyles}>
              {tableMeta.rowData[6] === "Completed" ? (
                tableMeta.rowData[3] > 0 ? (
                  <>
                      <Rating
                        initialRating={tableMeta.rowData[3]}
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
                  </>
                ) : (
                  <>
                    <span className="text-muted">*Not Yet Rated*</span>
                  </>
                )
              ) : (
                <button
                  className="btn btn-success btn-elevate btn-shadow-hover btn-sm"
                  onClick={() => {
                    setcompleteShow(true);
                    setcompleteData({
                      name,
                      id: value,
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
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Navigation/Double-check.svg"
                      )}
                      title="Mark As Completed"
                    />
                  </span>
                  Mark As Completed
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
              Floor
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
        download: true,
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
        filter: true,
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
              {value === "Alloted" && (
                <span className="label label-lg label-light-primary label-inline">
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
        searchable: false,
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
        searchable: false,
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
                title="Reject Clean-Request"
                className="btn btn-light-danger font-weight-bold mr-2"
                disabled={tableMeta.rowData[6] !== "Alloted" ? true : false}
                onClick={() => {
                  setRejectShow(true);
                  setRejectData({
                    value,
                    role: "roomkeeper",
                    name,
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
                    title="Reject Clean-Request"
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
      name: "message",
      options: {
        display: "excluded",
        print: false,
        download: false,
        searchable: false,
        filter: false,
      },
    },
  ];
  const options = {
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      return (
        <>
          <tr>
            <td className="font-weight-bold text-center">Instructions:</td>
            <td colSpan="10">
              {rowData[10] ? (
                <div className="text-dark-50">{rowData[10]} </div>
              ) : (
                <div className="text-muted">
                  <em>*-No Instructions Provided-*</em>
                </div>
              )}
            </td>
          </tr>
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
    searchOpen: true,
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
          <MUIDataTable
            title=""
            data={data}
            columns={columns}
            options={options}
            className="card card-custom shadow-none border-bottom-0 table table-head-custom table-vertical-center overflow-hidden mb-0"
          />
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
      <CompleteDialog
        data={completeData}
        hostel={hostel}
        onRefreshTable={(data) => {
          setData(data);
        }}
        show={completeShow}
        onHide={() => {
          setcompleteShow(false);
        }}
      />
    </>
  );
}

export default RoomKeeperPage;
