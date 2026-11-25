import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Ordered from primary model to high-capacity fallbacks
const MODEL_FALLBACK_CHAIN = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Retries a single model on transient 503/429 errors
async function callModelWithRetry(ai, model, prompt, config, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });
    } catch (error) {
      const status = error.status || error?.error?.code;
      const isTransient = status === 503 || status === 429;

      if (!isTransient || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, then 2s
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.warn(`[${model}] Busy (${status}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      await sleep(delay);
    }
  }
}

// Gemini response generator with retries + fallback models
async function generateAIResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const config = {
    maxOutputTokens: 1800,
    temperature: 0.7
  };

  let lastError;

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const response = await callModelWithRetry(ai, model, prompt, config);
      return response.text;
    } catch (error) {
      lastError = error;
      const status = error.status || error?.error?.code;

      // If overloaded or rate-limited, try the next model in the chain
      if (status === 503 || status === 429) {
        console.warn(`[${model}] Unavailable (${status}). Switching to fallback model...`);
        continue;
      }

      // For non-transient errors (e.g., invalid API key, bad request), fail immediately
      throw error;
    }
  }

  throw lastError;
}

// Centralized error handler for AI routes
function handleRouteError(res, label, error) {
  console.error(`${label}:`, error);

  const status = error.status || error?.error?.code;
  if (status === 503 || status === 429) {
    return res.status(503).json({
      error: 'The AI trainer is experiencing high demand right now. Please try again in a few seconds.'
    });
  }

  return res.status(500).json({
    error: error.message || 'An unexpected error occurred while generating the response.'
  });
}

// 1. Pet Matcher
router.post('/match', async (req, res) => {
  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({
        error: 'Lifestyle profile is required.'
      });
    }

    const prompt = `
      You are an expert shelter matching specialist.

      User Lifestyle:
      Housing: ${profile.housing}
      Time Away: ${profile.workHours}
      Activity: ${profile.activityLevel}
      Children: ${profile.hasChildren}
      Experience: ${profile.experience}

      List 2 ideal rescue pet profiles and
      3 actionable transition tips.

      Explain why each pet is suitable.
      Use clear headings and practical suggestions.
    `;

    const result = await generateAIResponse(prompt);
    res.json({ text: result });
  } catch (error) {
    handleRouteError(res, 'Matcher Error', error);
  }
});

// 2. Live Coach
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        error: 'Message is required.'
      });
    }

    const prompt = `
      You are an expert animal behaviorist
      and AI Pet Adaptation Coach.

      Answer this practical pet question:
      ${message}

      Give friendly, clear and helpful advice.
    `;

    const result = await generateAIResponse(prompt);
    res.json({ text: result });
  } catch (error) {
    handleRouteError(res, 'Chat Error', error);
  }
});

// 3. Seven-Day Planner
router.post('/planner', async (req, res) => {
  try {
    const prompt = `
      Generate a comprehensive 7-Day Settlement
      Timeline Blueprint for a newly adopted shelter pet
      transitioning into an urban home environment.

      Follow UN SDG 11.

      Include:
      Day 1 to Day 7 headings,
      Feeding schedules,
      Rest periods,
      Training activities,
      Socialization activities,
      Safety precautions,
      Daily routines.

      Make the plan practical, detailed and beginner-friendly.
    `;

    const result = await generateAIResponse(prompt);
    res.json({ text: result });
  } catch (error) {
    handleRouteError(res, 'Planner Error', error);
  }
});

export default router;
