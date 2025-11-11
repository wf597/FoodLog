# Food Log AI Modules

This package contains the core image‑analysis and nutrition‑calculation logic for
the **Food Log** application.  It is designed to integrate seamlessly with the
existing back‑end (`src/services`) and front‑end (`app/utils`) directory
structures of the project described in your repository.  The code adheres to
standard Node.js and TypeScript/React conventions and avoids any unnecessary
third‑party abstractions so that a TA or code reviewer can easily audit it.

## Structure

```
package/
│  README.md
├─ src/
│  └─ services/
│     ├─ imageAnalysis.js        # Node.js helper for AI image recognition
│     └─ imageAnalysisService.js # Node.js service to compute nutrition
└─ app/
   └─ utils/
      ├─ aiScanner.ts            # React Native helper to upload photos
      └─ nutritionAPI.ts         # React Native helper to query food data
```

### Back‑End (Node.js)

**`src/services/imageAnalysis.js`** wraps calls to an external AI endpoint
responsible for recognising food items in a photograph.  It uses `axios` and
`form-data` to perform a multipart upload and normalises the response into a
consistent format.  When the AI service is unavailable or when the
environment variable `USE_MOCK_AI` is set to a truthy value, the module
returns a small set of randomly chosen foods along with plausible bounding
boxes.  This mock behaviour helps exercise the rest of the system during
development and testing without incurring external API calls.

**`src/services/imageAnalysisService.js`** coordinates the detection results
with the MongoDB nutrition database.  For each detected food it fetches a
matching `FoodItem` document (using the model in `../models/FoodItem.js`),
estimates the weight based on the proportion of the image occupied
by the ingredient, and scales the nutrient values accordingly.  The
calculation follows the guidance from the course case study: use surface
area as a proxy for volume and then multiply by density tables to obtain
weight【188117195468454†L95-L109】.  Totals for calories and macronutrients
are returned alongside the per‑ingredient breakdown.  All numeric values are
rounded to two decimal places for clarity.

### Front‑End (React Native)

**`app/utils/aiScanner.ts`** abstracts the process of uploading a photo from
the mobile device to the `/api/food/analyze` endpoint.  It builds a
`FormData` payload with the image URI or `File`/`Blob`, attaches the JWT
token in the `Authorization` header, and parses the JSON response.  Any
non‑OK HTTP status results in an error being thrown so that your screens
can handle failures gracefully.

**`app/utils/nutritionAPI.ts`** contains convenience functions for searching
the nutrition database and retrieving individual food items.  It wraps the
`/api/food/search` endpoint exposed by your back end and returns the parsed
results.  If more granular endpoints are added in the future (e.g. by
ID), these helpers can be extended accordingly.

## Environment Variables

The back‑end modules rely on the following variables in your `.env` file:

| Variable | Purpose |
|---------|---------|
| `AI_API_ENDPOINT` | URL of the external AI service for food recognition |
| `AI_API_KEY` | API key used to authenticate requests to the AI service |
| `USE_MOCK_AI` | When truthy, bypasses the API and returns mock results |

If either `AI_API_ENDPOINT` or `AI_API_KEY` is undefined, the modules
automatically fall back to mock behaviour to avoid runtime errors.

## Integration Instructions

1. **Install dependencies** (if not already present in your back‑end):

   ```bash
   npm install axios form-data
   ```

2. **Copy the files** from `package/src/services/` into your existing
   `src/services` directory.  Do the same for the files in
   `package/app/utils/`, placing them into `app/utils` on the front‑end.
   Adjust import paths only if your project structure differs.

3. **Use the service in your Express route**.  For example, in
   `routes/food.js` you can do:

   ```js
   import { processFoodImage } from '../services/imageAnalysisService.js';

   router.post('/analyze', upload.single('image'), async (req, res, next) => {
     try {
       const { width, height } = req.body; // supply from your image parser
       const result = await processFoodImage(req.file.path, { width, height });
       res.json(result);
     } catch (err) {
       next(err);
     }
   });
   ```

4. **Invoke the scanner from React Native**.  In your `Scan` screen or
   equivalent, import and call the helper:

   ```tsx
   import { scanFood } from '../utils/aiScanner';

   const handleScan = async (photoUri: string) => {
     try {
       const token = await AsyncStorage.getItem('token');
       const result = await scanFood(photoUri, token, API_BASE_URL);
       // use result.ingredients and result.totals
     } catch (error) {
       console.error(error);
     }
   };
   ```

## Notes on Accuracy and Scalability

The course project emphasises high accuracy in both identification and
calorie calculation【188117195468454†L80-L109】.  The implementation here
performs weight estimation by using the proportional area of the ingredient’s
bounding box relative to the photo【188117195468454†L95-L109】.  This is a
simplification of the volume‑estimation process described in the case
study; you can refine it by incorporating camera metadata, depth
information or more sophisticated geometric models.  To meet scalability
requirements【188117195468454†L127-L133】, offload heavy computation to the
external AI service and keep the Node.js layer stateless; the mock mode
allows local testing without external dependencies.
