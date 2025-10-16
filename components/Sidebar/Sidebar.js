/* eslint-disable */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText,
  Media, NavbarBrand, Navbar, NavItem, NavLink, Nav,
  Collapse, Container, Row, Col
} from "reactstrap";

/** Normalize imgSrc: accept a string or a Next image import object */
const resolveImgSrc = (imgSrc) => {
  if (!imgSrc) return "";
  if (typeof imgSrc === "string") return imgSrc;
  if (typeof imgSrc === "object" && imgSrc.src) return imgSrc.src;
  return "";
};

function Sidebar(props) {
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  const toggleCollapse = () => setCollapseOpen((x) => !x);
  const closeCollapse = () => setCollapseOpen(false);

  /** Active check: more reliable than indexOf, works for nested routes */
  const isActive = (href) => router.pathname.startsWith(href);

  /** Render a list of routes. Supports optional:
   *  - prop.group: string -> renders a small section header above the item
   *  - prop.badge: string -> shows a small badge on the right of the item
   */
  const createLinks = (routes) =>
    routes.map((prop, key) => {
      // allow "section header" entries when prop.type === 'heading'
      if (prop.type === "heading") {
        return (
          <h6 key={`heading-${key}`} className="navbar-heading text-muted mt-3">
            {prop.name}
          </h6>
        );
      }

      const href = `${prop.layout || ""}${prop.path || ""}`;
      const active = isActive(href);

      return (
        <NavItem key={key} active={active}>
          <Link href={href} passHref legacyBehavior>
            <NavLink onClick={closeCollapse} className={active ? "active" : ""}>
              {prop.icon ? <i className={prop.icon} /> : null}
              <span className="ml-2">{prop.name}</span>
              {prop.badge ? (
                <span className="badge badge-sm badge-primary ml-auto">{prop.badge}</span>
              ) : null}
            </NavLink>
          </Link>
        </NavItem>
      );
    });

  const { routes, logo } = props;
  const brandImgSrc = resolveImgSrc(logo?.imgSrc);

  const navbarBrand = (
    <NavbarBrand className="pt-0">
      <img alt={logo?.imgAlt || "brand"} className="navbar-brand-img" src={brandImgSrc} />
    </NavbarBrand>
  );

  return (
    <Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
      <Container fluid>
        {/* Toggler */}
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo?.innerLink ? (
          <Link href={logo.innerLink} passHref legacyBehavior>
            <a className="navbar-brand pt-0">{navbarBrand}</a>
          </Link>
        ) : logo?.outterLink ? (
          <a href={logo.outterLink} target="_blank" rel="noopener noreferrer" className="navbar-brand pt-0">
            {navbarBrand}
          </a>
        ) : null}

        {/* User (mobile) */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu aria-labelledby="navbar-default_dropdown_1" className="dropdown-menu-arrow" right>
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img alt="..." src="/assets/img/theme/team-1-800x800.jpg" />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>

              <Link href="/admin/profile" passHref legacyBehavior>
                <DropdownItem><i className="ni ni-single-02" /><span>My profile</span></DropdownItem>
              </Link>
              <Link href="/admin/profile" passHref legacyBehavior>
                <DropdownItem><i className="ni ni-settings-gear-65" /><span>Settings</span></DropdownItem>
              </Link>
              <Link href="/admin/profile" passHref legacyBehavior>
                <DropdownItem><i className="ni ni-calendar-grid-58" /><span>Activity</span></DropdownItem>
              </Link>
              <Link href="/admin/profile" passHref legacyBehavior>
                <DropdownItem><i className="ni ni-support-16" /><span>Support</span></DropdownItem>
              </Link>

              <DropdownItem divider />
              <DropdownItem href="#!" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link href={logo.innerLink} passHref legacyBehavior>
                      <a><img alt={logo.imgAlt || "brand"} src={brandImgSrc} /></a>
                    </Link>
                  ) : (
                    <a href={logo.outterLink} target="_blank" rel="noopener noreferrer">
                      <img alt={logo.imgAlt || "brand"} src={brandImgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Search (mobile) */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input aria-label="Search" className="form-control-rounded form-control-prepended" placeholder="Search" type="search" />
              <InputGroupAddon addonType="prepend">
                <InputGroupText><span className="fa fa-search" /></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>

          {/* Navigation from routes.js */}
          <Nav navbar>{createLinks(routes)}</Nav>

          {/* Divider */}
          <hr className="my-3" />

          {/* Heading */}
          {/* <h6 className="navbar-heading text-muted">Documentation</h6> */}

          {/* External links */}
          {/* <Nav className="mb-md-3" navbar>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/learning-lab/nextjs/overview/argon-dashboard?ref=njsad-admin-sidebar">
                <i className="ni ni-spaceship" />
                Getting started
              </NavLink>
            </NavItem> */}
            {/* <NavItem>
              <NavLink href="https://www.creative-tim.com/learning-lab/nextjs/colors/argon-dashboard?ref=njsad-admin-sidebar">
                <i className="ni ni-palette" />
                Foundation
              </NavLink>
            </NavItem> */}
            {/* <NavItem>
              <NavLink href="https://www.creative-tim.com/learning-lab/nextjs/avatar/argon-dashboard?ref=njsad-admin-sidebar">
                <i className="ni ni-ui-04" />
                Components
              </NavLink>
            </NavItem>
          </Nav> */}

        </Collapse>
      </Container>
    </Navbar>
  );
}

Sidebar.defaultProps = { routes: [{}] };

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
