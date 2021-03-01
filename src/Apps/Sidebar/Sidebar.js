import React, { useEffect, useState } from "react";
import "./Sidebar.css";
// import { Paper, Button } from '@material-ui/core/';
import Zaf from "../../Services/Zendesk";

export default function Sidebar() {
  // const [test, setTest] = useState("");

  useEffect(() => {
    Zaf.client.on("ticket.save", function () {
      return new Promise((resolve, reject) => {
        resolve();
        // reject();
      });
    });
  }, []);

  return <></>;
}
