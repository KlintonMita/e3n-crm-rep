import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
    return (
        <div className="header">
            <div className="header-img">
                <img src="" alt="Image not uploaded" />
            </div>
            <div className="header-components">
                <Link to="/">Home</Link>
                <Link to="/">Workers</Link>
                <Link to="/">Daily Plan</Link>
            </div>
        </div>
    )
}


export default Header;