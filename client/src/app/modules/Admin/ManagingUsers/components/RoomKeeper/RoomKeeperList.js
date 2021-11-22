import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import MUIDataTable from "mui-datatables";
import Axios from "axios";
import { DeleteDialog } from "../UI/DeleteDialog";
import SVG from "react-inlinesvg";
import Rating from "react-rating";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { Button } from "react-bootstrap";

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
function RoomKeeperList(props) {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("");
  const [deleteData, setDeleteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const hostel = useSelector(
    (state) => state.auth.user.user.hostel,
    shallowEqual
  );
  useEffect(() => {
    Axios.get(`/api/users?hostel=${hostel}&role=roomkeeper`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setLoading(false);
      });
  }, [hostel, props]);

  const columns = [
    // {
    //   name: "id",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     display: "excluded",
    //   },
    // },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              name
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return (
            <>
              <div className="symbol symbol-35 symbol-light mr-4 ml-4">
                <span
                  className="symbol-label"
                  style={{
                    backgroundImage: `url(${
                      tableMeta.rowData[6]
                        ? tableMeta.rowData[6]
                        : toAbsoluteUrl("/media/users/blank.png")
                    })`,
                  }}
                ></span>
              </div>
              <span
                className="align-top"
                style={{ ...bodyStyles, lineHeight: 3 }}
              >
                {value}
              </span>
            </>
          );
        },
      },
    },
    {
      name: "email",
      label: "E-mail",
      options: {
        filter: false,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              e-mail
            </span>
          );
        },
        customBodyRender: (value) => {
          return <span style={bodyStyles}>{value}</span>;
        },
      },
    },
    {
      name: "phone",
      label: "Phone No.",
      options: {
        filter: false,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              phone no.
            </span>
          );
        },
        customBodyRender: (value) => {
          return value ? (
            <span style={bodyStyles}>{value}</span>
          ) : (
            <span className="text-muted font-weight-bolder">N/A</span>
          );
        },
      },
    },
    {
      name: "ratings",
      label: "Ratings",
      sortThirdClickReset: true,
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Ratings
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return value > 0 ? (
            <>
              <Rating
                initialRating={value}
                fractions={10}
                readonly
                emptySymbol={
                  <span className="svg-icon svg-icon-lg">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/General/Star.svg")}
                    />
                  </span>
                }
                fullSymbol={
                  <span className="svg-icon svg-icon-lg svg-icon-primary">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/General/Star.svg")}
                    />
                  </span>
                }
              />
              <br />
              <em className="text-muted font-size-sm font-weight-bold">
                Total {tableMeta.rowData[5]} Ratings.
              </em>
            </>
          ) : (
            <em className="text-muted font-size-lg font-weight-dark-50">
              *Not Yet Rated*
            </em>
          );
        },
      },
    },
    {
      name: "Actions",
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
                title="Delete Student"
                className="btn btn-icon btn-light btn-hover-danger btn-sm "
                onClick={() => {
                  setShow(true);
                  setAction("single");
                  setDeleteData(tableMeta.rowData[1]);
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                    title="Delete Student"
                  />
                </span>
              </button>
            </div>
          );
        },
      },
    },
    {
      name: "count",
      label: "Total Ratings",
      options: {
        filter: false,
        sort: false,
        print: false,
        searchable: false,
        display: "excluded",
        sortThirdClickReset: true,
      },
    },
    {
      name: "profileimg",
      options: {
        display: "excluded",
        filter: false,
        sort: false,
        download: false,
        print: false,
        searchable: false,
      },
    },
  ];
  const options = {
    // serverSide: true,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      const arr = selectedRows.data.map((row) => {
        return displayData[row.index].data[1].props.children;
      });
      // console.log(arr);
      return (
        <div className="mb-2 mt-2 no-shadow">
          <button
            type="button"
            className="btn btn-danger font-weight-bolder font-size-sm"
            onClick={() => {
              setDeleteData(arr);
              setAction("selected");
              setShow(true);
              setSelectedRows([]);
            }}
          >
            <i className="fa fa-trash"></i> Delete Selected
          </button>
        </div>
      );
    },
    filter: true,
    // searchAlwaysOpen: true,
    rowHover: false,
    searchOpen: false,
    // selectToolbarPlacement	: 'above',
    tableId: "roomkeeperList",
    filterType: "dropdown",
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      body: {
        noMatch: "Sorry, no RoomKeeper records found",
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
              RoomKeeper List
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Manage or Remove RoomKeepers from your organization.
            </span>
          </div>
          <CardHeaderToolbar>
            <Button
              variant="outline-danger"
              // className="btn btn-danger"
              onClick={() => {
                setAction("all");
                setShow(true);
              }}
            >
              <i className="fa fa-trash"></i> Delete All RoomKeepers
            </Button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody className="p-0" style={{ zIndex: "0" }}>
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
      {action === "all" && (
        <DeleteDialog
          role="roomkeeper"
          action="all"
          hostel={hostel}
          onRefreshTable={(data) => {
            setData(data);
          }}
          show={show}
          onHide={() => {
            setShow(false);
          }}
        />
      )}
      {action === "selected" && (
        <DeleteDialog
          role="roomkeeper"
          data={deleteData}
          action={action}
          hostel={hostel}
          onRefreshTable={(data) => {
            setData(data);
          }}
          show={show}
          onHide={() => {
            setShow(false);
          }}
        />
      )}
      {action === "single" && (
        <DeleteDialog
          role="roomkeeper"
          data={deleteData}
          action={action}
          hostel={hostel}
          onRefreshTable={(data) => {
            setData(data);
          }}
          show={show}
          onHide={() => {
            setShow(false);
          }}
        />
      )}
    </>
  );
}

export default RoomKeeperList;
