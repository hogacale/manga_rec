import React from "react";
import {Nav, NavLink} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function Navbar () {
    return (
            <div className="navigation">
                <Nav className="navbar navbar-expand navbar-dark bg-dark">
                    <div className="container">
                        <NavLink className="navbar-brand" to="/">
                            Manga Recommender
                        </NavLink>
                        <div>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Search
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/filter" >
                                        Filter
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Nav>
            </div>
    );
};
