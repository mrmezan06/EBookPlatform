import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="left">
        <p>© 2022 EBook.com</p>
      </div>
      <div className="right">
        <p>
          Created by{" "}
          <a href="https://www.github.com/mrmezan06">Mejanur Rahman</a>
        </p>
        <div className="power">
          Powered By <a href="https://netlify.app/">Netlify</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
