import React from "react";
import Admin from "layouts/Admin.js";
import { useWhoAmI } from "hooks/useEntitlements";

function WhoAmIContent() {
  const { data, isLoading } = useWhoAmI();
  const features = data?.features || {};
  const limits = data?.limits || {};

  return (
    <>
      {/* Top spacer banner */}
      <div className="header bg-dark pt-5 pb-6"></div>

      {/* Normal margin (no mt--6) */}
      <div className="container-fluid mt-4">
        {/* Title + breadcrumb */}
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="h3 mb-0 text-dark">Resolved Entitlements</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-links">
                <li className="breadcrumb-item">
                  <a href="#"><i className="ni ni-box-2" /></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">WhoAmI</li>
              </ol>
            </nav>
          </div>
          {data?.tenantId && (
            <div className="col-auto">
              <span className="badge badge-light text-uppercase">Tenant</span>{" "}
              <span className="badge badge-primary">{data.tenantId}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="row">
          {/* Features */}
          <div className="col-xl-6">
            <div className="card shadow rounded mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Features</h3>
              </div>
              <div className="card-body">
                {isLoading && <p className="mb-0">Loading…</p>}
                {!isLoading && Object.keys(features).length === 0 && (
                  <p className="text-muted mb-0">No feature flags.</p>
                )}
                {!isLoading && Object.entries(features).map(([k, v]) => (
                  <div key={k} className="list-group-item d-flex justify-content-between align-items-center rounded mb-2">
                    <span className="text-monospace">{k}</span>
                    <span className={`badge badge-${v ? "success" : "secondary"}`}>
                      {v ? "TRUE" : "FALSE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="col-xl-6">
            <div className="card shadow rounded mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Limits</h3>
              </div>
              <div className="card-body">
                {isLoading && <p className="mb-0">Loading…</p>}
                {!isLoading && Object.keys(limits).length === 0 && (
                  <p className="text-muted mb-0">No limits configured.</p>
                )}
                {!isLoading && Object.entries(limits).map(([k, v]) => {
                  const used = Number(v.used || 0);
                  const limit = v.limit == null ? null : Number(v.limit);
                  const pct = limit ? Math.min(100, (used / limit) * 100) : 100;
                  const near = limit && used / limit > 0.8;

                  return (
                    <div key={k} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-monospace">{k}</strong>
                        <span className="text-muted">{used} / {limit ?? "∞"}</span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className={`progress-bar ${near ? "bg-danger" : ""}`}
                          role="progressbar"
                          style={{ width: `${pct}%` }}
                          aria-valuenow={used}
                          aria-valuemin={0}
                          aria-valuemax={limit ?? undefined}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Explicit wrapper to guarantee navbar + sidebar
export default function WhoAmIPage() {
  return (
    <Admin>
      <WhoAmIContent />
    </Admin>
  );
}
