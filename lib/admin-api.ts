/**
 * Admin API client — thin wrappers around fetch for use in client components.
 * All requests include credentials so the admin_token cookie is sent.
 */

const BASE = "/api/admin";

async function req<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  req("POST", "/auth/login", { email, password });

export const adminLogout = () => req("DELETE", "/auth/login");

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const fetchDashboardStats = () => req("GET", "/dashboard");

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchAdminProducts = (params?: Record<string, string | number>) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return req("GET", `/products${qs}`);
};
export const fetchAdminProduct = (id: string) => req("GET", `/products/${id}`);
export const createProduct = (data: unknown) => req("POST", "/products", data);
export const updateProduct = (id: string, data: unknown) => req("PATCH", `/products/${id}`, data);
export const deleteProduct = (id: string) => req("DELETE", `/products/${id}`);

// ─── Categories ───────────────────────────────────────────────────────────────
export const fetchAdminCategories = () => req("GET", "/categories");
export const createCategory = (data: unknown) => req("POST", "/categories", data);
export const updateCategory = (id: string, data: unknown) => req("PATCH", `/categories/${id}`, data);
export const deleteCategory = (id: string) => req("DELETE", `/categories/${id}`);

// ─── Brands ───────────────────────────────────────────────────────────────────
export const fetchAdminBrands = () => req("GET", "/brands");
export const createBrand = (data: unknown) => req("POST", "/brands", data);
export const updateBrand = (id: string, data: unknown) => req("PATCH", `/brands/${id}`, data);
export const deleteBrand = (id: string) => req("DELETE", `/brands/${id}`);

// ─── Orders ───────────────────────────────────────────────────────────────────
export const fetchAdminOrders = (params?: Record<string, string | number>) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return req("GET", `/orders${qs}`);
};
export const fetchAdminOrder = (id: string) => req("GET", `/orders/${id}`);
export const updateOrder = (id: string, data: unknown) => req("PATCH", `/orders/${id}`, data);

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchAdminUsers = (params?: Record<string, string | number>) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return req("GET", `/users${qs}`);
};
export const fetchAdminUser = (id: string) => req("GET", `/users/${id}`);
export const updateUser = (id: string, data: unknown) => req("PATCH", `/users/${id}`, data);
export const deleteUser = (id: string) => req("DELETE", `/users/${id}`);

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const fetchAdminCoupons = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return req("GET", `/coupons${qs}`);
};
export const createCoupon = (data: unknown) => req("POST", "/coupons", data);
export const updateCoupon = (id: string, data: unknown) => req("PATCH", `/coupons/${id}`, data);
export const deleteCoupon = (id: string) => req("DELETE", `/coupons/${id}`);

// ─── Banners ──────────────────────────────────────────────────────────────────
export const fetchAdminBanners = () => req("GET", "/banners");
export const createBanner = (data: unknown) => req("POST", "/banners", data);
export const updateBanner = (id: string, data: unknown) => req("PATCH", `/banners/${id}`, data);
export const deleteBanner = (id: string) => req("DELETE", `/banners/${id}`);

// ─── Settings ─────────────────────────────────────────────────────────────────
export const fetchAdminSettings = () => req("GET", "/settings");
export const updateAdminSettings = (data: unknown) => req("PUT", "/settings", data);

