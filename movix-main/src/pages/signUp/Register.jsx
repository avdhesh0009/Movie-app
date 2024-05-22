import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { userRegThunk } from "../../store/auth/authSlice";
import { authActions } from "../../store/auth/authSlice";
import "./style.scss";
// import { register, reset } from '../features/auth/authSlice'
// import Spinner from '../components/Spinner'

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate("/");
      if (isSuccess) {
        toast.success("Registration successful!");
      }
    }

    dispatch(authActions.reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if(password.length < 6)
      {
        toast.error("password length should be greater than or equal to six");
      }
    else if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(userRegThunk(userData));
      setFormData({
        name: "",
        email: "",
        password: "",
        password2: "",
      })
    }
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <div style={{marginTop:"3rem"}}>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
            <ToastContainer/>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
