import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "../container/Home";
import Navbar from "../container/navBar";
import Register from "../container/Register";
import Login from "../container/login";
import AuthProvider from "../container/Authentication/Auth";
import PrivateRoute from "../container/routes";

import React, { Component } from 'react'

class BaseNavigator extends Component {
    render() {

        return (
            <div>
                <AuthProvider>
                    <BrowserRouter>
                        {/* <Navbar /> */}
                        <Switch>
                            <PrivateRoute exact path="/" component={Home} />
                            <div>
                            <Navbar />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            </div>
                        </Switch>
                    </BrowserRouter>
                </AuthProvider>
            </div>
        )
    }
}

export default BaseNavigator