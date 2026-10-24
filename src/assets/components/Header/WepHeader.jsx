import React from "react";
import WepNavbar from "./WepNavbar";
import MainNav from "./MainNav";

const WepHeader = () => {
  return (
    <>
      <div className="bg-white">
        <WepNavbar />
      <MainNav />
      </div>
    </>
  );
};

export default WepHeader;
