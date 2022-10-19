import React from "react";
import "./read.css";

const Read = () => {
  const path = window.location;
  console.log(path.search.replace("?key=", ""));
  const key = path.search.replace("?key=", "");

  return (
    <div className="read">
      <iframe
        src={`https://drive.google.com/file/d/${key}/preview`}
        key={key}
        width="100%"
        height="900"
        allow="autoplay"
        title={key}
      ></iframe>
    </div>
  );
};

export default Read;
