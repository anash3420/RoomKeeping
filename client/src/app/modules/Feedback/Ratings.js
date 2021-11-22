import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import MUIDataTable from "mui-datatables";
import Axios from "axios";
import SVG from "react-inlinesvg";
import Rating from "react-rating";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
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
function Ratings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user.user, shallowEqual);
  const hostel = user.hostel;
  const id = user._id;
  const role = useSelector(({ auth }) => auth.user.role);
  useEffect(() => {
    Axios.get(`/api/ratings?hostel=${hostel}&role=${role}&id=${id}`)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
        setLoading(false);
      });
  }, [hostel, id, role]);

  const columns = [
    {
      name: "name",
      label: "RoomKeeper",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span
              className="table-vertical-center ml-4 mr-4"
              style={headStyles}
            >
              {role !== "roomkeeper" ? "RoomKeeper" : "Student"}
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
                className="align-top font-weight-bold text-muted font-size-lg"
                style={{ lineHeight: 2.5 }}
              >
                {value}
              </span>
            </>
          );
        },
      },
    },
    {
      name: "student",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        display: role === "admin" ? true : "excluded",
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Student
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
                      tableMeta.rowData[7]
                        ? tableMeta.rowData[7]
                        : toAbsoluteUrl("/media/users/blank.png")
                    })`,
                  }}
                ></span>
              </div>
              <span
                className="align-top font-weight-bold text-muted font-size-lg"
                style={{ lineHeight: 2.5 }}
              >
                {value}
              </span>
            </>
          );
        },
      },
    },
    {
      name: "room",
      label: "Room",
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Room
            </span>
          );
        },
        customBodyRender: (value, tableMeta) => {
          return <span style={bodyStyles}>{value}</span>;
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
              date
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
      label: "Rating",
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
        customBodyRender: (value) => {
          return (
            <Rating
              initialRating={value}
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
          );
        },
      },
    },
    {
      name: "message",
      label: "Message",
      options: {
        filter: false,
        sort: false,
        customHeadLabelRender: () => {
          return (
            <span className="table-vertical-center" style={headStyles}>
              Message
            </span>
          );
        },
        customBodyRender: (value) => {
          return (
            <span className="text-left font-weight-dark text-muted">
              {value ? value : <em>*No message provided!*</em>}
            </span>
          );
        },
      },
    },
    {
      name: "img",
      options: {
        display: "excluded",
        filter: false,
        sort: false,
        print: false,
        download: false,
      },
    },
    {
      name: "studentImg",
      options: {
        display: "excluded",
        filter: false,
        sort: false,
        print: false,
        download: false,
      },
    },
  ];
  const options = {
    filter: true,
    selectableRows: "none",
    rowHover: false,
    searchOpen: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      body: {
        noMatch: "Sorry, no Ratings records found!",
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
              Ratings Record
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              Check Ratings For Clean-Requests.
            </span>
          </div>
          <CardHeaderToolbar></CardHeaderToolbar>
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
    </>
  );
}

export default Ratings;
