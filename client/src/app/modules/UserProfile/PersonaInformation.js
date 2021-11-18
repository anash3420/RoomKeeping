import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import Axios from "axios";
import SVG from "react-inlinesvg";
import { isNull } from "lodash";
import { Button } from "react-bootstrap";

function PersonaInformation(props) {
  // Fields
  const [loading, setloading] = useState(false);
  const [pic, setPic] = useState("");
  const [updated,setUpdated] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user, shallowEqual);
  const role = useSelector(({ auth }) => auth.user.role, shallowEqual);
  useEffect(() => {
    if (user.profileimg) {
      setPic(user.profileimg);
    }
  }, [user]);
  // Methods
  const saveUser = (values, setStatus, setSubmitting) => {
    setloading(true);
    // console.log(values);
    const formData = new FormData();
    !isNull(values.profileimg) && formData.append('profileimg',values.profileimg);
    formData.append('name',values.name);
    formData.append('phone',values.phone);
    formData.append('email',values.email);
    formData.append('role',role);
    formData.append('id',user._id);
    formData.append('changeimg',values.changeimg);
    // user for update preparation
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      Axios.post("/api/updateUser", formData)
        .then(function(response) {
          setUpdated(true);
          dispatch(props.setUser({ user: response.data, role: role }));
          setloading(false);
          formik.resetForm();
        })
        .catch(function(error) {
          console.log(error);
          setloading(false);
          setSubmitting(false);
          setStatus(error);
        });
    }, 1000);
  };
  // UI Helpers
  const initialValues = {
    changeimg: false,
    profileimg: (user.profileimg ? user.profileimg : ''),
    name: user.name,
    phone: user.phone,
    email: user.email,
  };
  const Schema = Yup.object().shape({
    changeimg:Yup.bool(),
    profileimg: Yup.mixed(),
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .length(10).required("Phone number is required"),
    email: Yup.string()
      .email("Wrong email format")
      .required("Email is required"),
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
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      formik.setValues({...initialValues});
    },
  });
  const getUserPic = () => {
    if (!pic) {
      return "none";
    }

    return `url(${pic})`;
  };
  const removePic = () => {
    setPic(null);
    formik.setFieldValue("profileimg",null);
    formik.setFieldValue("changeimg",true);
  };
  const handlePhoto = (e) => {
    setPic(URL.createObjectURL(e.target.files[0]));
    formik.setFieldValue("profileimg",e.target.files[0]);
    formik.setFieldValue("changeimg",true);
  }
  return (
    <form
      className="card card-custom card-stretch"
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
      encType = "multipart/form-data"
    >
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            Personal Information
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            Update your personal informaiton
          </span>
        </div>
        <div className="card-toolbar">
          <button
            type="submit"
            className="btn btn-success mr-2"
            disabled={
              formik.isSubmitting || (formik.touched && !formik.isValid)
            }
          >
            Save Changes
            {formik.isSubmitting}
          </button>
          <Button
            className="btn btn-secondary"
            type = 'reset'
          >
            Cancel
          </Button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        {/* begin::Body */}
        <div className="card-body">
        {updated && (
            <div
              className="alert alert-custom alert-light-success fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-success">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Done-circle.svg")}
                  ></SVG>{" "}
                </span>
              </div>
              <div className="alert-text font-weight-bold">
                Details Updated Successfully!
              </div>
              <div className="alert-close" onClick={() => setUpdated(false)}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i className="ki ki-close"></i>
                  </span>
                </button>
              </div>
            </div>
          )}
          <div className="row">
            <label className="col-xl-3"></label>
            <div className="col-lg-9 col-xl-6">
              <h5 className="font-weight-bold mb-6">Personal Info</h5>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">Avatar</label>
            <div className="col-lg-9 col-xl-6">
              <div
                className="image-input image-input-outline"
                id="kt_profile_avatar"
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/users/blank.png"
                  )}`,
                }}
              >
                <div
                  className="image-input-wrapper"
                  style={{ backgroundImage: `${getUserPic()}` }}
                />
                <label
                  className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                  data-action="change"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Change avatar"
                >
                  <i className="fa fa-pen icon-sm text-muted"></i>
                  <input
                    type="file"
                    name="profileimg"
                    accept=".png, .jpg, .jpeg"
                    onChange = {handlePhoto}
                    // {...formik.getFieldProps("pic")}
                  />
                  <input type="hidden" name="profile_avatar_remove" />
                </label>
                <span
                  className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                  data-action="cancel"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Cancel avatar"
                >
                  <i className="ki ki-bold-close icon-xs text-muted"></i>
                </span>
                <span
                  onClick={removePic}
                  className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                  data-action="remove"
                  data-toggle="tooltip"
                  title=""
                  data-original-title="Remove avatar"
                >
                  <i className="ki ki-bold-close icon-xs text-muted"></i>
                </span>
              </div>
              <span className="form-text text-muted">
                Allowed file types: png, jpg, jpeg.
              </span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">Name</label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="Full Name"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "firstname"
                )}`}
                name="name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.firstname && formik.errors.firstname ? (
                <div className="invalid-feedback">
                  {formik.errors.firstname}
                </div>
              ) : null}
            </div>
          </div>
          <div className="row">
            <label className="col-xl-3"></label>
            <div className="col-lg-9 col-xl-6">
              <h5 className="font-weight-bold mt-10 mb-6">Contact Info</h5>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Contact Phone
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-phone"></i>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="+91"
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "phone"
                  )}`}
                  name="phone"
                  {...formik.getFieldProps("phone")}
                />
              </div>
              {formik.touched.phone && formik.errors.phone ? (
                <div className="invalid-feedback display-block">
                  {formik.errors.phone}
                </div>
              ) : null}
              <span className="form-text text-muted">
                We'll never share your phone with anyone else.
              </span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label">
              Email Address
            </label>
            <div className="col-lg-9 col-xl-6">
              <div className="input-group input-group-lg input-group-solid">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-at"></i>
                  </span>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`form-control form-control-lg form-control-solid ${getInputClasses(
                    "email"
                  )}`}
                  name="email"
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback display-block">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Form */}
    </form>
  );
}

export default connect(null, auth.actions)(PersonaInformation);
