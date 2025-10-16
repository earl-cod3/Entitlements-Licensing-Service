// hooks/useEntitlements.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJSON, postJSON } from "../lib/api";

const isBrowser = typeof window !== "undefined";

/** Central keys so we don’t mistype them elsewhere */
export const QK = {
  whoami: ["whoami"],
  plans: ["plans"],
  features: ["features"],
  tenants: ["tenants"],
  usage: (tenantId) => ["usage", tenantId],
};

const baseQueryOpts = {
  enabled: isBrowser,             // don’t run during SSR
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 1,
  staleTime: 10_000,              // 10s fresh
  gcTime: 5 * 60 * 1000,          // 5 min cache
  keepPreviousData: true,
};

/* -------------------- QUERIES -------------------- */

export const useWhoAmI = () =>
  useQuery({
    ...baseQueryOpts,
    queryKey: QK.whoami,
    queryFn: () => getJSON("/whoami"),
    // ensure predictable shapes for UI
    select: (d) =>
      d || { tenantId: null, features: {}, limits: {} },
  });

export const usePlans = () =>
  useQuery({
    ...baseQueryOpts,
    queryKey: QK.plans,
    queryFn: () => getJSON("/plans"),
    select: (rows) => Array.isArray(rows) ? rows : [],
  });

export const useFeatures = () =>
  useQuery({
    ...baseQueryOpts,
    queryKey: QK.features,
    queryFn: () => getJSON("/features"),
    select: (rows) => Array.isArray(rows) ? rows : [],
  });

export const useTenants = () =>
  useQuery({
    ...baseQueryOpts,
    queryKey: QK.tenants,
    queryFn: () => getJSON("/tenants"),
    select: (rows) => Array.isArray(rows) ? rows : [],
  });

export const useUsage = (tenantId) =>
  useQuery({
    ...baseQueryOpts,
    enabled: isBrowser && !!tenantId,
    queryKey: QK.usage(tenantId),
    queryFn: () => getJSON(`/usage/${tenantId}`),
    select: (d) => d || { metrics: {} },
  });

/* -------------------- MUTATIONS -------------------- */

/** Assign a plan to a tenant (with optimistic UI) */
export const useAssignPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    /** @param {{ tenantId: string, payload: { plan_id: string } }} vars */
    mutationFn: ({ tenantId, payload }) =>
      postJSON(`/entitlements/${tenantId}`, payload),

    // Optimistic update: swap the tenant’s plan name locally
    onMutate: async ({ tenantId, payload }) => {
      await qc.cancelQueries({ queryKey: QK.tenants });
      const previous = qc.getQueryData(QK.tenants);

      qc.setQueryData(QK.tenants, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((t) =>
          t.id === tenantId ? { ...t, plan: { ...(t.plan || {}), id: payload.plan_id } } : t
        );
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(QK.tenants, ctx.previous);
    },

    onSuccess: (_res, { tenantId }) => {
      qc.invalidateQueries({ queryKey: QK.tenants });
      qc.invalidateQueries({ queryKey: QK.whoami });
      qc.invalidateQueries({ queryKey: QK.usage(tenantId) });
    },
  });
};

/** Create plan */
export const useCreatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    /** @param {{ code:string, name:string, stripe_price_id?:string|null, is_active?:boolean }} payload */
    mutationFn: (payload) => postJSON("/plans", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.plans }),
  });
};

/** Create feature */
export const useCreateFeature = () => {
  const qc = useQueryClient();
  return useMutation({
    /** @param {{ key:string, type:'boolean'|'numeric', default_value?:number }} payload */
    mutationFn: (payload) => postJSON("/features", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.features }),
  });
};
