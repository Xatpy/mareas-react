import React from "react";

import { Container } from "./components/Container";
import { Header } from "./components/Header";

import "./Main.css";

export const Main: React.FC = () => {
  return (
    <div className="main">
      <Header />
      <Container />
    </div>
  );
};
