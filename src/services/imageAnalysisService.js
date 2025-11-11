/*
 * imageAnalysisService.js
 *
 * Orchestrates food detection, portion size estimation and nutrition
 * computation.  Exported function `processFoodImage` accepts an image
 * (path or Buffer) plus its dimensions, invokes the detection service,
 * queries MongoDB for matching food items, estimates weights based on
 * bounding boxes, scales nutrient values, and returns per‑ingredient and
 * aggregate totals.  If no matching food item is found, the ingredient
 * still appears in the result with its estimated weight and zeroed out
 * nutrients.
 */

import { detectFoods } from './imageAnalysis.js';
import FoodItem from '../models/FoodItem.js';

/**
 * Estimate weight from bounding box area and typical serving weight.  This
 * heuristic measures the ratio of the bounding box area to the total
 * image area and multiplies it by a scale factor and the typical
 * serving size.  The scale factor is used to compensate for the
 * conversion from 2D area to 3D volume.  A minimum weight of 1 g is
 * enforced to avoid zero division later.
 *
 * @param {{width:number,height:number}} box The bounding box.
 * @param {{width:number,height:number}} imageSize The full image dimensions.
 * @param {number} typical Typical serving size in grams (default 100).
 * @returns {number} Estimated weight in grams.
 */
function estimateWeight(box, imageSize, typical = 100) {
  const areaBox = (box.width || 0) * (box.height || 0);
  const areaImage = (imageSize.width || 0) * (imageSize.height || 0);
  if (!areaImage || !areaBox) return typical;
  const ratio = areaBox / areaImage;
  const scaleFactor = 1.8;
  const weight = ratio * scaleFactor * typical;
  return Math.max(1, weight);
}

/**
 * Scale nutrition values per 100 g by a weight factor.
 *
 * @param {Object} per100g Nutrition per 100 g.
 * @param {number} weight Estimated weight in grams.
 * @returns {Object} Scaled nutrition.
 */
function scaleNutrition(per100g, weight) {
  const f = weight / 100;
  return {
    calories: (per100g.calories || 0) * f,
    protein: (per100g.protein || 0) * f,
    carbs: (per100g.carbs || 0) * f,
    fat: (per100g.fat || 0) * f,
    fiber: (per100g.fiber || 0) * f,
    sugar: (per100g.sugar || 0) * f,
    sodium: (per100g.sodium || 0) * f,
    cholesterol: (per100g.cholesterol || 0) * f
  };
}

/**
 * Sum up an array of nutrition objects into a single totals object.
 *
 * @param {Array<Object>} list Array of nutrition objects.
 * @returns {Object} Totals for each nutrient.
 */
function sumTotals(list) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0
  };
  for (const item of list) {
    for (const key of Object.keys(totals)) {
      totals[key] += item[key] || 0;
    }
  }
  return totals;
}

/**
 * Process an image to identify ingredients and compute nutrition.
 *
 * @param {string|Buffer} imageInput Path or Buffer of the image.
 * @param {{width:number,height:number}} imageSize Image dimensions.
 * @returns {Promise<{ingredients:Array,Object>}> An object with
 * ingredients and totals.
 */
export async function processFoodImage(imageInput, imageSize = { width: 0, height: 0 }) {
  // 1. Run detection
  const detections = await detectFoods(imageInput, imageSize);
  const ingredients = [];
  const nutrientList = [];
  for (const det of detections) {
    const name = (det.name || 'unknown').trim().toLowerCase();
    let record = null;
    try {
      record = await FoodItem.findOne({ name: new RegExp(`^${name}$`, 'i') });
    } catch (err) {
      console.warn(`Food lookup error for ${name}:`, err.message);
    }
    const typical = record?.servingSize?.amount || 100;
    const weight = estimateWeight(det.boundingBox, imageSize, typical);
    const nutrition = scaleNutrition(record?.nutritionPer100g || {}, weight);
    nutrientList.push(nutrition);
    ingredients.push({
      name,
      confidence: det.confidence,
      boundingBox: det.boundingBox,
      weight: Number(weight.toFixed(2)),
      nutrients: Object.fromEntries(Object.entries(nutrition).map(([k, v]) => [k, Number(v.toFixed(2))]))
    });
  }
  const totalsRaw = sumTotals(nutrientList);
  const totals = Object.fromEntries(Object.entries(totalsRaw).map(([k, v]) => [k, Number(v.toFixed(2))]));
  return { ingredients, totals };
}

export default { processFoodImage };