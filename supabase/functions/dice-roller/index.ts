import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { secureRoll } from "./rng.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RollRequest {
  formula: string;
}

interface RollResult {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
}

function parseAndRoll(formula: string): RollResult {
  // Matches e.g. 3d6, 1d20+2, 2d8 - 1
  const regex = /^(\d+)?d(\d+)(?:\s*([+-])\s*(\d+))?$/i;
  const match = formula.trim().match(regex);
  
  if (!match) {
    throw new Error("Invalid dice formula. Use format like '3d6' or '1d20+2'.");
  }
  
  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const sign = match[3] || '+';
  const modValue = match[4] ? parseInt(match[4], 10) : 0;
  const modifier = sign === '-' ? -modValue : modValue;
  
  if (count > 100) {
    throw new Error("Cannot roll more than 100 dice at once.");
  }
  
  if (sides < 2 || sides > 1000) {
    throw new Error("Dice sides must be between 2 and 1000.");
  }
  
  const rolls: number[] = [];
  let sum = 0;
  
  for (let i = 0; i < count; i++) {
    const roll = secureRoll(sides);
    rolls.push(roll);
    sum += roll;
  }
  
  return {
    formula,
    rolls,
    modifier,
    total: sum + modifier
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { formula } = await req.json() as RollRequest;
    
    if (!formula) {
      throw new Error("Missing 'formula' in request body.");
    }
    
    const result = parseAndRoll(formula);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
