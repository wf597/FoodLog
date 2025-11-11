/*
 * nutritionAPI.ts
 *
 * Client‑side helpers to interact with the nutrition endpoints exposed by
 * the back end.  These functions wrap fetch calls to perform food
 * searches and fetch individual items.  Errors are propagated to the
 * caller for handling at the UI level.
 */

export interface FoodItem {
  _id?: string;
  name: string;
  brand?: string;
  category?: string;
  servingSize: {
    amount: number;
    unit: string;
  };
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
  };
}

/**
 * Search for foods that match the provided query string.
 *
 * @param query User search term.
 * @param token Optional JWT for authentication.
 * @param apiUrl Optional base URL of the API.
 */
export async function searchFoods(query: string, token = '', apiUrl = ''): Promise<FoodItem[]> {
  const url = new URL(`${apiUrl}/api/food/search`);
  url.searchParams.append('query', query);
  const res = await fetch(url.toString(), {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    throw new Error(`Food search failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Retrieve a single food item by name.  Currently this performs a search
 * and returns the first result.  If your back end exposes a direct
 * lookup endpoint, you can modify this function to call it instead.
 */
export async function getFood(name: string, token = '', apiUrl = ''): Promise<FoodItem | null> {
  const results = await searchFoods(name, token, apiUrl);
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

export default { searchFoods, getFood };