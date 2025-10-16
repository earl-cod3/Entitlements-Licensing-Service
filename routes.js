// routes.js
import Dashboard from "pages/admin/dashboard";
import Plans from "pages/admin/plans";
import Features from "pages/admin/features";
import Tenants from "pages/admin/tenants";
import Usage from "pages/admin/usage";
import WhoAmI from "pages/admin/whoami";

// Optional: keep these if you still use the demo pages
import Icons from "pages/admin/icons";
import Maps from "pages/admin/maps";
import Profile from "pages/admin/profile";
import Tables from "pages/admin/tables";

// --- Admin sidebar routes ---
const routes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "ni ni-chart-bar-32 text-primary",
  //   component: Dashboard,
  //   layout: "/admin",
  // },

  // Demo pages (optional)
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin",
  // },

  // Section header (rendered by updated Sidebar)
  // { type:"heading", name: "Entitlements" ,className: "navbar-heading text-muted" },

  {
    path: "/plans",
    name: "Plans",
    icon: "ni ni-bullet-list-67 text-orange",
    component: Plans,
    layout: "/admin",
  },
  {
    path: "/features",
    name: "Features",
    icon: "ni ni-collection text-info",
    component: Features,
    layout: "/admin",
  },
  {
    path: "/tenants",
    name: "Tenants",
    icon: "ni ni-single-02 text-yellow",
    component: Tenants,
    layout: "/admin",
  },
  {
    path: "/usage",
    name: "Usage",
    icon: "ni ni-chart-pie-35 text-success",
    component: Usage,
    layout: "/admin",
  },
  {
    path: "/whoami",
    name: "WhoAmI",
    icon: "ni ni-badge text-purple",
    component: WhoAmI,
    layout: "/admin",
  },
];

export default routes;

// --- Auth layout routes (not shown in Admin sidebar) ---
// Keep these pages, but don't include them in the Admin routes array above.
export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    layout: "/auth",
  },
];
