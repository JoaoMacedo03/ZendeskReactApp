import React from "react";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

import Sidebar from "./Apps/MySideBar/index";
import Navbar from "./Apps/Navbar/Navbar";

var search = window.location.search.match(/(type|modal)=([a-z_]+)/);

var page;
switch (search[2]) {
  case "navbar":
    page = <Navbar />;
    break;
  case "sidebar":
    page = <Sidebar />;
    break;

  default:
}

export default function App() {
  return (
    <>
      {page}
      <NotificationContainer />
    </>
  );
}
