import React from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Game from "./components/Game/Game";
import Information from "./components/Information/Information";
import Footer from "./components/Footer/Footer";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Game />
      <Information />
      <Footer />
    </AuthProvider>
  );
}

export default App;
