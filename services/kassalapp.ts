const API_URL = process.env.EXPO_PUBLIC_KASSALAPP_URL!;
const API_KEY = process.env.EXPO_PUBLIC_KASSALAPP_KEY!;

// Generic request helper
async function kassalappRequest<T>(endpoint: string, params?: Record<string, any>, method: "GET" | "POST" = "GET", body?: any): Promise<T> {
  let url = `${API_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const query = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    url += url.includes("?") ? `&${query}` : `?${query}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) throw new Error(`Kassalapp API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// PRODUCTS

export function searchProducts(query: string, sort?: string) {
  return kassalappRequest<{ data: any[] }>("/products", { search: query, sort });
}

export function getProductById(id: string) {
  return kassalappRequest<any>(`/products/id/${id}`);
}

export function getProductByEan(ean: string) {
  return kassalappRequest<any>(`/products/ean/${ean}`);
}

export function findProductByUrlSingle(url: string) {
  return kassalappRequest<any>("/products/find-by-url/single", { url });
}

export function findProductByUrlCompare(url: string) {
  return kassalappRequest<any>("/products/find-by-url/compare", { url });
}

// PHYSICAL STORES

export function getPhysicalStores() {
  return kassalappRequest<any[]>("/physical-stores");
}

export function getPhysicalStoreById(id: string) {
  return kassalappRequest<any>(`/physical-stores/${id}`);
}