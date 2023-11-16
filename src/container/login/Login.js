import React, { Component } from 'react'
import { Link } from "react-router-dom";
import "../../Design/Login.css"
// import signin from "../../image/signin.svg";

import {
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";

import { useHistory } from "react-router-dom";

class Login1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Data: {
        email: "",
        password: ""
      }
    }
  }

  //onChange Handler
  handleChange = (e) => {
    const { Data } = this.state
    this.setState({
      Data: { ...Data, [e.target.name]: e.target.value }
    });
  }

  //handle when submit a form
  handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = this.state.Data
    const { password } = this.state.Data
    try {
      console.log("------------------try----------------");
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("result", result);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      this.setState({
        email: "",
        password: "",
      });
      this.props.history.replace("/");
    } catch (err) {
      console.log("error", err.message);
      // setData({ ...data, error: err.message, loading: false });
    }
  }


  render() {
    const { Data } = this.state
    console.log("Dtaa is ", Data);
    const { email } = this.state.Data
    const { password } = this.state.Data
    return (
      <div className="book" id="book">
        <h1 className="heading">
          {" "}
          <span>Login</span> here{" "}
        </h1>

        <div className="row">
          <div className="image">
            {/* <img
              style={{ border: 0 }}
              src={signin}
              alt=""
              className="register-img"
            /> */}
          </div>

          <form name="userRegistation" >
            <h3>Login Now</h3>

            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              placeholder="Your Email"
              className="box"
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              placeholder="Password"
              id="pswd"
              className="box"
            />
            <input
              type="button"
              value="Login"
              className="btn1"
              onClick={(e) => this.handleSubmit(e)}
            />
            <Link to="/Register" className="already-done">
              I don't have account.
            </Link>

            {/* <Link to="/Register" variant="body2">
          <input type="submit" value="Register" className="btn  cansal-btn" />{" "}
        </Link> */}
          </form>
        </div>
      </div>
    )
  }
}

// export default Login

function Login(props) {
  const history = useHistory();
  return <Login1 {...props} history={history} />
}
export default Login;
