import React from "react";
import { useRouter } from "next/router";
import { Container } from "reactstrap";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

// ✅ Option B: static import for the logo image
import brandBlack from "assets/img/brand/nextjs_argon_black.png";

function Admin(props) {
  const router = useRouter();
  const mainContentRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement && (document.scrollingElement.scrollTop = 0);
    }
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  }, []);

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: brandBlack, // static import object (Sidebar resolves .src)
          imgAlt: "Brand",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar {...props} brandText={getBrandText()} />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Admin;
