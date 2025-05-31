import { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import management from "../../assets/img/management.png";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidenav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="header">
            <div className="header-img">
                <img src={management} alt="Image not uploaded" />
            </div>
            <div className="menu-icon" onClick={toggleSidenav}>
                &#9776;
            </div>
            <div className={`header-components ${isOpen ? "sidenav-open" : ""}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/employees" onClick={() => setIsOpen(false)}>Employees</Link>
                <Link to="/daily" onClick={() => setIsOpen(false)}>Daily Plan</Link>
                <Link to="/working" onClick={() => setIsOpen(false)}>Working hours</Link>
            </div>
        </div>
    );
}


export default Header;
