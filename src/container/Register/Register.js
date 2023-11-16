import React, { Component } from 'react'
import { Link } from "react-router-dom";
// import regiimg from "../../image/register-img.svg";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp  } from "firebase/firestore";

import { useHistory } from "react-router-dom";

class Register1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Data: {
        name: "",
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

  //register new Data on click of submit
  handleSubmit = async (e) => {
    const { email } = this.state.Data
    const { password } = this.state.Data
    const { name } = this.state.Data
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password  
      );

      console.log("result is" ,result);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      this.setState({
        name: "",
        email: "",
        password: "",
      });
      this.props.history.replace("/");
    } catch (err) {
      // setData({ ...data, error: err.message, loading: false });
    }
  }


  render() {
    const { Data } = this.state
    console.log("Dtaa is ", Data);
    const { email } = this.state.Data
    const { password } = this.state.Data
    const { name } = this.state.Data
    return (
      <div className="book" id="book">
      <h1 className="heading">
        {" "}
        <span>Register</span> here{" "}
      </h1>

      <div className="row">
        {/* <div className="image">
          <img
            style={{ border: 0 }}
            src={regiimg}
            alt=""
            className="register-img"
          />
        </div> */}

        <form name="userRegistation">
          {/* register components here */}
          <h3>Register Now</h3>

          <input
            type="name"
            name="name"
            value={name}
            onChange={this.handleChange}
            placeholder="Your name"
            className="box"
          />

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
            value="Register"
            className="btn1"
            onClick={this.handleSubmit}
          />
          <Link to="/" className="already-done">
            already have account?  signIn 
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

// export default Register;

function Register(props) {
  const history = useHistory();
  return <Register1 {...props} history={history} />
}
export default Register;