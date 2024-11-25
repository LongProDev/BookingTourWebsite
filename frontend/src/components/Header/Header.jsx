import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import "./header.css";
import ToursDropdown from './ToursDropdown';
import UserDropdown from './UserDropdown';

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav__links = [
    {
      path: "/home",
      display: "Home"
    },
    {
      path: "/about",
      display: "About"
    },
    {
      path: "/tours",
      display: "Tours"
    }
  ];

  if (user?.role === 'admin') {
    nav__links.push({
      path: "/admin",
      display: "Admin Management",
      adminOnly: true,
    });
  }

  const stickyHeaderFunc = () => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
          headerRef.current.classList.add("sticky__header");
        } else {
          headerRef.current.classList.remove("sticky__header");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  };

  useEffect(() => {
    const cleanup = stickyHeaderFunc();
    return cleanup;
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="logo">
              <Link to="/home">
                <img src={logo} alt="" />
              </Link>
            </div>

            <div className={`navigation ${menuOpen ? "show__menu" : ""}`} ref={menuRef}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink to={item.path} onClick={toggleMenu}>
                      {item.display}
                    </NavLink>
                    {item.path === "/tours" && <ToursDropdown />}
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {user ? (
                  <UserDropdown />
                ) : (
                  <Button className="btn secondary__btn">
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </div>

              <span className="mobile__menu" onClick={toggleMenu}>
                <i className={`ri-menu-line ${menuOpen ? "ri-close-line" : "ri-menu-line"}`}></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
