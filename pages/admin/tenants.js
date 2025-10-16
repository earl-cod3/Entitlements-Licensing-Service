import React, { useState } from "react";
import Admin from "layouts/Admin.js";
import { useTenants, usePlans, useAssignPlan } from "hooks/useEntitlements";

function TenantsContent() {
  const { data: tenants = [], isLoading } = useTenants();
  const { data: plans = [] } = usePlans();
  const assignPlan = useAssignPlan();

  const [pendingId, setPendingId] = useState(null);
  const [msg, setMsg] = useState(null); // { type: "success"|"danger", text: string }

  const onAssign = async (tenantId, e) => {
    const planId = e.target.value;
    if (!planId) return;
    try {
      setPendingId(tenantId);
      await assignPlan.mutateAsync({ tenantId, payload: { plan_id: planId } });
      setMsg({ type: "success", text: "Plan updated." });
    } catch (err) {
      setMsg({ type: "danger", text: err?.message || "Failed to update plan." });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <div className="header bg-dark pt-5 pb-6"></div>

      <div className="container-fluid mt-4">
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="h3 mb-0 text-dark">Tenants</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-links">
                <li className="breadcrumb-item">
                  <a href="#"><i className="ni ni-box-2" /></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Tenants</li>
              </ol>
            </nav>
          </div>
        </div>

        {msg && (
          <div className={`alert alert-${msg.type}`} role="alert">
            {msg.text}
          </div>
        )}

        <div className="card shadow rounded">
          <div className="card-header border-0">
            <h3 className="mb-0">Tenants</h3>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-items-center">
              <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Current Plan</th>
                  <th style={{ width: 280 }}>Change Plan</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={3}>Loading…</td></tr>
                )}

                {!isLoading && tenants.map((t) => (
                  <tr key={t.id}>
                    <td className="font-weight-bold">{t.name}</td>
                    <td>
                      {t.plan?.name
                        ? <span className="badge badge-primary">{t.plan.name}</span>
                        : <span className="text-muted">-</span>}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        defaultValue=""
                        onChange={(e) => onAssign(t.id, e)}
                        disabled={pendingId === t.id || assignPlan.isPending}
                      >
                        <option value="" disabled>Choose…</option>
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {!isLoading && tenants.length === 0 && (
                  <tr><td colSpan={3}>No tenants yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// Explicit wrapper guarantees navbar + sidebar
export default function TenantsPage() {
  return (
    <Admin>
      <TenantsContent />
    </Admin>
  );
}
