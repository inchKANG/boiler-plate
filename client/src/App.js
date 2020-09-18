import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//view
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import NavBar from "./components/views/NavBar/NavBar";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import auth from './hoc/auth';



//exact path 로 적거나, exact = {true} 옵션을 줘야 한다. 주지 않으면,앞부분에서 일부분만 일치해도, 실행이 되어 버린다.
export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={auth(LandingPage,null)} />
          <Route exact path="/login" component={auth(LoginPage,false)} />
          <Route exact path="/register" component={auth(RegisterPage,false)} />
        </Switch>
      </div>
    </Router>
  );
}
