import React, { useRef } from "react";
import Admin from "layouts/Admin.js";
import { usePlans, useCreatePlan } from "hooks/useEntitlements";

function PlansContent() {
  const { data: plans = [], isLoading } = usePlans();
  const createPlan = useCreatePlan();
  const formRef = useRef(null);

  const onCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createPlan.mutateAsync({
      code: String(form.get("code") || "").trim(),
      name: String(form.get("name") || "").trim(),
      stripe_price_id: (form.get("stripe_price_id") || "") || null,
      is_active: true,
    });
    formRef.current?.reset();
  };

  return (
    <>
      <div className="header bg-dark pt-5 pb-6"></div>
      <div className="container-fluid mt-4">
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="h3 mb-0 text-dark">Plans</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-links">
                <li className="breadcrumb-item"><a href="#"><i className="ni ni-box-2" /></a></li>
                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Plans</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          {/* List */}
          <div className="col-xl-7">
            <div className="card shadow rounded">
              <div className="card-header border-0 d-flex align-items-center">
                <h3 className="mb-0">Plans</h3>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-items-center">
                  <thead className="thead-light">
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Stripe Price</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan="4">Loading…</td></tr>
                    )}
                    {!isLoading && plans.map((p) => (
                      <tr key={p.id}>
                        <td className="text-uppercase text-muted font-weight-bold">{p.code}</td>
                        <td>{p.name}</td>
                        <td>{p.stripePriceId || "-"}</td>
                        <td>
                          <span className={`badge badge-${p.isActive ? "success" : "secondary"}`}>
                            {p.isActive ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!isLoading && plans.length === 0 && (
                      <tr><td colSpan="4">No plans yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Create */}
          <div className="col-xl-5 mt-4 mt-xl-0">
            <div className="card shadow rounded" style={{ position: "sticky", top: "6rem" }}>
              <div className="card-header"><h3 className="mb-0">Create Plan</h3></div>
              <div className="card-body">
                {createPlan.isError && (
                  <div className="alert alert-danger" role="alert">
                    {(createPlan.error && createPlan.error.message) || "Failed to create plan."}
                  </div>
                )}
                {createPlan.isSuccess && (
                  <div className="alert alert-success" role="alert">Plan created.</div>
                )}

                <form ref={formRef} onSubmit={onCreate}>
                  <div className="form-group mb-3">
                    <label className="form-control-label">Code</label>
                    <input name="code" className="form-control" placeholder="e.g. pro" required />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-control-label">Name</label>
                    <input name="name" className="form-control" placeholder="e.g. Pro" required />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-control-label">Stripe Price ID (optional)</label>
                    <input name="stripe_price_id" className="form-control" placeholder="price_123..." />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={createPlan.isPending}>
                    {createPlan.isPending ? "Saving…" : "Save"}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// Explicit wrapper guarantees navbar + sidebar
export default function PlansPage() {
  return (
    <Admin>
      <PlansContent />
    </Admin>
  );
}
