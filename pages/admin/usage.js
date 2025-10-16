import React, { useEffect, useState } from "react";
import Admin from "layouts/Admin.js";
import { useTenants, useUsage } from "hooks/useEntitlements";

function UsageContent() {
  const { data: tenants = [] } = useTenants();
  const [tenantId, setTenantId] = useState("");
  const { data, isLoading } = useUsage(tenantId); // make sure the hook disables when tenantId === ""

  useEffect(() => {
    if (!tenantId && tenants.length > 0) setTenantId(tenants[0].id);
  }, [tenants, tenantId]);

  const metrics = data?.metrics || {};

  return (
    <>
      <div className="header bg-dark pt-5 pb-6"></div>

      <div className="container-fluid mt-4">
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="h3 mb-0 text-dark">Usage</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-links">
                <li className="breadcrumb-item">
                  <a href="#"><i className="ni ni-box-2" /></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Usage</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          {/* Tenant picker */}
          <div className="col-xl-4">
            <div className="card shadow rounded" style={{ position: "sticky", top: "6rem" }}>
              <div className="card-header"><h3 className="mb-0">Select Tenant</h3></div>
              <div className="card-body">
                <select
                  className="form-control"
                  onChange={(e) => setTenantId(e.target.value)}
                  value={tenantId}
                  disabled={tenants.length === 0}
                >
                  {tenants.length === 0 && <option value="">No tenants</option>}
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Usage panel */}
          <div className="col-xl-8 mt-4 mt-xl-0">
            <div className="card shadow rounded">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h3 className="mb-0">Usage</h3>
                {tenantId ? <span className="text-muted small">Tenant: {tenantId}</span> : null}
              </div>

              <div className="card-body">
                {!tenantId && <p className="text-muted mb-0">Select a tenant to view usage.</p>}
                {tenantId && isLoading && <p className="mb-0">Loading…</p>}

                {tenantId && !isLoading && Object.keys(metrics).length === 0 && (
                  <p className="text-muted mb-0">No metrics yet.</p>
                )}

                {tenantId && !isLoading && Object.entries(metrics).map(([metric, info]) => {
                  const used = Number(info.used || 0);
                  const limit = info.limit == null ? null : Number(info.limit);
                  const pct = limit ? Math.min(100, (used / limit) * 100) : 100;
                  const nearLimit = !!(limit && used / limit > 0.8);

                  return (
                    <div key={metric} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-uppercase">{metric}</strong>
                        <span className="text-muted">{used} / {limit ?? "∞"}</span>
                      </div>

                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className={`progress-bar ${nearLimit ? "bg-danger" : ""}`}
                          role="progressbar"
                          style={{ width: `${pct}%` }}
                          aria-valuenow={used}
                          aria-valuemin={0}
                          {...(limit != null ? { "aria-valuemax": limit } : {})}
                        />
                      </div>

                      <small className="text-muted">Resets: {info.resets_on}</small>
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

// Explicit wrapper guarantees navbar + sidebar
export default function UsagePage() {
  return (
    <Admin>
      <UsageContent />
    </Admin>
  );
}
