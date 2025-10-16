import React, { useRef } from "react";
import Admin from "layouts/Admin.js";
import { useFeatures, useCreateFeature } from "hooks/useEntitlements";

function FeaturesContent() {
  const { data: features = [], isLoading } = useFeatures();
  const createFeature = useCreateFeature();
  const formRef = useRef(null);

  const onCreate = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    await createFeature.mutateAsync({
      key: String(f.get("key") || "").trim(),
      type: (f.get("type") || "boolean").toString(), // "boolean" | "numeric"
      default_value: Number(f.get("default_value") || 0),
    });

    formRef.current?.reset();
  };

  return (
    <>
      {/* Give the header breathing room */}
      <div className="header bg-dark pt-5 pb-6"></div>

      {/* Normal margin (no mt--6) */}
      <div className="container-fluid mt-4">
        {/* Title + breadcrumb */}
        <div className="row align-items-center mb-3">
          <div className="col">
            <h1 className="h3 mb-0 text-dark">Features</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-links">
                <li className="breadcrumb-item">
                  <a href="#"><i className="ni ni-box-2" /></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Features
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          {/* List */}
          <div className="col-xl-7">
            <div className="card shadow rounded">
              <div className="card-header border-0 d-flex align-items-center">
                <h3 className="mb-0">Features</h3>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-items-center">
                  <thead className="thead-light">
                    <tr>
                      <th>Key</th>
                      <th>Type</th>
                      <th>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan="3">Loading…</td></tr>
                    )}
                    {!isLoading && features.map((x) => (
                      <tr key={x.id}>
                        <td className="text-monospace">{x.key}</td>
                        <td>
                          <span className={`badge badge-${x.type === "boolean" ? "info" : "secondary"}`}>
                            {x.type}
                          </span>
                        </td>
                        {/* Prisma/API returns camelCase: defaultValue */}
                        <td>{x.defaultValue}</td>
                      </tr>
                    ))}
                    {!isLoading && features.length === 0 && (
                      <tr><td colSpan="3">No features yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Create (sticky) */}
          <div className="col-xl-5 mt-4 mt-xl-0">
            <div className="card shadow rounded" style={{ position: "sticky", top: "6rem" }}>
              <div className="card-header"><h3 className="mb-0">Create Feature</h3></div>
              <div className="card-body">
                {createFeature.isError && (
                  <div className="alert alert-danger" role="alert">
                    {(createFeature.error && createFeature.error.message) || "Failed to create feature."}
                  </div>
                )}
                {createFeature.isSuccess && (
                  <div className="alert alert-success" role="alert">Feature created.</div>
                )}

                <form ref={formRef} onSubmit={onCreate}>
                  <div className="form-group mb-3">
                    <label className="form-control-label">Key</label>
                    <input name="key" className="form-control" placeholder="e.g. projects, webhooks" required />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-control-label">Type</label>
                    <select name="type" className="form-control" required defaultValue="boolean">
                      <option value="boolean">boolean</option>
                      <option value="numeric">numeric</option>
                    </select>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-control-label">Default Value</label>
                    <input name="default_value" type="number" className="form-control" defaultValue="0" />
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={createFeature.isPending}>
                    {createFeature.isPending ? "Saving…" : "Save"}
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

// Explicit wrapper to guarantee the layout
export default function FeaturesPage() {
  return (
    <Admin>
      <FeaturesContent />
    </Admin>
  );
}
