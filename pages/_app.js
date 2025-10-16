// pages/_app.js

/* HARD GUARD (SSR): remove any fake window on the server */
if (typeof window === "undefined" && typeof global !== "undefined" && global.window) {
  try { delete global.window; } catch (_) { global.window = undefined; }
}

import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// Styles
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/nextjs-argon-dashboard.css";

// Router transitions (browser only)
if (typeof window !== "undefined") {
  Router.events.on("routeChangeStart", (url) => {
    console.log(`Loading: ${url}`);
    document.body.classList.add("body-page-transition");
    const mountNode = document.getElementById("page-transition");
    if (mountNode) {
      ReactDOM.render(<PageChange path={url} />, mountNode);
    }
  });

  const clearTransition = () => {
    const mountNode = document.getElementById("page-transition");
    if (mountNode) {
      try { ReactDOM.unmountComponentAtNode(mountNode); } catch {}
    }
    document.body.classList.remove("body-page-transition");
  };

  Router.events.on("routeChangeComplete", clearTransition);
  Router.events.on("routeChangeError", clearTransition);
}

export default class MyApp extends App {
  componentDidMount() {
    // Dev token so our Axios helper can send Authorization during setup
    if (!localStorage.getItem("token")) localStorage.setItem("token", "dev-token");

    // Template comment (browser only)
    const comment = document.createComment(`
=========================================================
* * NextJS Argon Dashboard v1.1.0 based on Argon Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard
* Copyright 2021 Creative Tim
* Licensed under MIT

* Coded by Creative Tim
=========================================================
`);
    document.insertBefore(comment, document.documentElement);
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          {/* Remove this script if you don't need Google Maps */}
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
        </Head>

        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </>
    );
  }
}
