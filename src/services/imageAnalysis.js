/*
 * imageAnalysis.js
 *
 * This module exposes a single async function, `detectFoods`, which
 * accepts an image (either a file path or a Buffer) and optional image
 * dimensions, uploads it to an external recognition service and returns a
 * list of detected foods.  Each result contains a name, confidence score
 * and bounding box.  When the service is unavailable or mock mode is
 * enabled, the function generates plausible random results to allow the
 * remainder of the pipeline to function.
 */

import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

/**
 * Generate a random bounding box that fits within the given dimensions.
 * Used when falling back to mock detection.
 *
 * @param {number} width  Width of the image.
 * @param {number} height Height of the image.
 * @returns {{x:number,y:number,width:number,height:number}} A bounding box.
 */
function randomBox(width, height) {
  const w = Math.max(50, Math.floor(Math.random() * (width / 2)));
  const h = Math.max(50, Math.floor(Math.random() * (height / 2)));
  const x = Math.floor(Math.random() * (width - w));
  const y = Math.floor(Math.random() * (height - h));
  return { x, y, width: w, height: h };
}

/**
 * Create a set of mock detections for development and testing.
 *
 * @param {number} width  Image width.
 * @param {number} height Image height.
 * @returns {Array<{name:string,confidence:number,boundingBox:Object}>}
 */
function mockDetections(width, height) {
  const candidates = ['apple', 'banana', 'salad', 'toast', 'chicken', 'rice', 'yoghurt'];
  const count = Math.floor(Math.random() * 3) + 1;
  const picks = [];
  const used = new Set();
  while (picks.length < count) {
    const idx = Math.floor(Math.random() * candidates.length);
    if (!used.has(idx)) {
      used.add(idx);
      picks.push(candidates[idx]);
    }
  }
  return picks.map(item => ({
    name: item,
    confidence: Number((Math.random() * 0.4 + 0.6).toFixed(2)),
    boundingBox: randomBox(width, height)
  }));
}

/**
 * Detect foods in an image using a remote recognition service.
 *
 * @param {string|Buffer} imageInput File path or Buffer containing the image.
 * @param {{width:number,height:number}} imageSize Dimensions of the image; used when generating mocks.
 * @returns {Promise<Array<{name:string,confidence:number,boundingBox:Object}>>}
 */
export async function detectFoods(imageInput, imageSize = { width: 0, height: 0 }) {
  const { width = 0, height = 0 } = imageSize;
  const useMock = process.env.USE_MOCK_AI && process.env.USE_MOCK_AI !== 'false';
  const endpoint = process.env.AI_API_ENDPOINT;
  const apiKey = process.env.AI_API_KEY;
  if (useMock || !endpoint || !apiKey) {
    return mockDetections(width, height);
  }
  const form = new FormData();
  if (Buffer.isBuffer(imageInput)) {
    form.append('image', imageInput, { filename: 'photo.jpg' });
  } else if (typeof imageInput === 'string') {
    form.append('image', fs.createReadStream(imageInput));
  } else {
    throw new Error('Unsupported image input type');
  }
  try {
    const res = await axios.post(endpoint, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`
      }
    });
    const { data } = res;
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }
    return data.map(item => ({
      name: item.label || item.name || 'unknown',
      confidence: typeof item.confidence === 'number' ? item.confidence : 1,
      boundingBox: {
        x: item.box?.x ?? item.boundingBox?.x ?? 0,
        y: item.box?.y ?? item.boundingBox?.y ?? 0,
        width: item.box?.width ?? item.boundingBox?.width ?? 0,
        height: item.box?.height ?? item.boundingBox?.height ?? 0
      }
    }));
  } catch (err) {
    console.warn('Food recognition service error:', err.message);
    return mockDetections(width, height);
  }
}

export default { detectFoods };