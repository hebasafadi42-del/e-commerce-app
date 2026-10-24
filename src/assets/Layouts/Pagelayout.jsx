import React from "react";
import WepHeader from "../components/Header/WepHeader";
import WepFooter from "../components/Footer/WepFooter";

const Pagelayout = ({ children }) => {
  
  return (
    <>
      <WepHeader />
      <div>{children}</div>
      <WepFooter/>
    </>
  );
};

export default Pagelayout;
