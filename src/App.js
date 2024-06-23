/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import "./App.css";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Navbar from "./components/NavBar";
import Saved from "./pages/Saved";
import ProfileOthers from "./pages/ProfileOthers";
import logo from "./components/logo.png";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/Home",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver();
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <Navbar isSignedIn={isSignedIn} />
        <div
          style={{
            marginTop: "45px",
            textAlign: "center",
            transform: "scale(1.1)",
          }}
        >
          <img src={logo} width={"7%"} style={{ marginBottom: "10px" }}></img>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Router>
        <Navbar
          isSignedIn={isSignedIn}
          username={firebase.auth().currentUser.displayName}
        />
        <Routes>
          <Route path="/Profile" element={<Profile />} />
        </Routes>
        <Routes>
          <Route path="/ProfileEdit" element={<ProfileEdit />} />
        </Routes>
        <Routes>
          <Route path="/ProfileOthers" element={<ProfileOthers />} />
        </Routes>
        <Routes>
          <Route path="/Saved" element={<Saved />} />
        </Routes>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
