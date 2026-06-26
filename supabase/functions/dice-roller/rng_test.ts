import { assertEquals, assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { secureRoll } from "./rng.ts";

/**
 * Chi-Square Goodness of Fit Test
 * Tests if the distribution of rolls is uniform.
 */
function chiSquareTest(rolls: number[], sides: number): number {
  const expected = rolls.length / sides;
  const counts = new Array(sides).fill(0);
  
  for (const roll of rolls) {
    counts[roll - 1]++;
  }
  
  let chiSquare = 0;
  for (const count of counts) {
    chiSquare += Math.pow(count - expected, 2) / expected;
  }
  
  return chiSquare;
}

Deno.test("Secure Roll - d20 Distribution (Chi-Square Test)", () => {
  const sides = 20;
  const numRolls = 100000;
  const rolls = [];
  
  for (let i = 0; i < numRolls; i++) {
    const roll = secureRoll(sides);
    assert(roll >= 1 && roll <= sides, `Roll ${roll} is out of bounds for d${sides}`);
    rolls.push(roll);
  }
  
  const chiSq = chiSquareTest(rolls, sides);
  
  // Degrees of freedom for d20 is 19.
  // For alpha = 0.05, critical value is approx 30.144
  // We'll set a generous critical value of 45 to avoid flaky tests due to extreme RNG luck,
  // but anything significantly biased would blow up to 100+.
  console.log(`\n[STAT TEST] Chi-Square for d${sides} (n=${numRolls}): ${chiSq.toFixed(2)}`);
  assert(chiSq < 45, `Chi-Square value ${chiSq} is too high, indicating possible bias!`);
});

Deno.test("Secure Roll - all shadowdark dice bounds & distribution", () => {
  const diceTypes = [4, 6, 8, 10, 12, 20];
  const numRolls = 50000;
  
  for (const sides of diceTypes) {
    const rolls = [];
    for (let i = 0; i < numRolls; i++) {
      const roll = secureRoll(sides);
      assert(roll >= 1 && roll <= sides, `Roll ${roll} is out of bounds for d${sides}`);
      rolls.push(roll);
    }
    
    const chiSq = chiSquareTest(rolls, sides);
    // Rough critical values for df=3 to 19. 45 is safe for all.
    console.log(`[STAT TEST] Chi-Square for d${sides} (n=${numRolls}): ${chiSq.toFixed(2)}`);
    assert(chiSq < 45, `Chi-Square for d${sides} is too high (${chiSq})`);
  }
});
