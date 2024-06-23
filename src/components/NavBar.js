import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import * as backend from "../../src/backend";

const NavBar = (props) => {
  const addProfile = async () => {
    await backend.addToProfile();
  };

  useEffect(() => {
    if (props.isSignedIn) {
      addProfile();
    }
  }, []);

  return (
    <nav className="navbar is-info" style={{ paddingTop: "5px" }}>
      <div
        className="container"
        style={{ paddingLeft: "32px", paddingRight: "32px" }}
      >
        <div className="navbar-brand">
          <a style={{ fontSize: "25px" }} className="navbar-item" href="/">
            <b>BestMatch</b>
          </a>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        {props.isSignedIn && (
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end">
              <Link to="/Home" className="navbar-item">
                <div>Home</div>
              </Link>
              <Link to="/Saved" className="navbar-item">
                <div>Saved</div>
              </Link>
              <Link to="/Profile" className="navbar-item">
                <div>Profile</div>
              </Link>
              <Link to="/Home" className="navbar-item">
                <div>Welcome! {props.username}</div>
              </Link>
              &nbsp;&nbsp;
              <div style={{ marginTop: "7px" }}>
                <button
                  className="button is-info"
                  onClick={() => firebase.auth().signOut()}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
