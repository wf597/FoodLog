/*
 * aiScanner.ts
 *
 * Helper for uploading photos from the React Native app to the back‑end
 * analysis endpoint.  It builds a FormData payload, attaches the JWT
 * token for authorisation and returns the parsed JSON response.  If the
 * HTTP request fails, an error is thrown with the status code and
 * response text.  Use this in the food scanning screen to invoke the
 * analysis and display results.
 */

export interface ScanResult {
  ingredients: Array<{
    name: string;
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
    weight: number;
    nutrients: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
      cholesterol: number;
    };
  }>;
  totals: {
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
 * Upload a captured food photo for analysis.
 *
 * @param image A URI, Blob or File representing the image to analyse.
 * @param token JWT for authentication.
 * @param apiUrl Optional base URL of the API (defaults to empty string, so requests go to the same origin).
 */
export async function scanFood(image: string | Blob | File, token: string, apiUrl = ''): Promise<ScanResult> {
  const formData = new FormData();
  if (typeof image === 'string') {
    formData.append('image', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg'
    } as any);
  } else {
    formData.append('image', image);
  }
  const res = await fetch(`${apiUrl}/api/food/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Do not set Content-Type; fetch will set the correct boundary for FormData
    },
    body: formData
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${text}`);
  }
  return res.json();
}

export default { scanFood };