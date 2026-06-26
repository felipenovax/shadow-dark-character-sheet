/**
 * Generates a random number uniformly distributed between 1 and N.
 * Uses the Web Crypto API for secure entropy and Rejection Sampling
 * to eliminate modulo bias.
 */
export function secureRoll(sides: number): number {
  if (sides <= 1) return 1;

  // Max value of Uint32 is 4294967295, so there are 4294967296 possible values.
  const maxUint32 = 4294967296;
  const maxAcceptable = maxUint32 - (maxUint32 % sides);
  
  const buffer = new Uint32Array(1);
  
  while (true) {
    crypto.getRandomValues(buffer);
    const value = buffer[0];
    
    // Rejection sampling: if the value falls in the biased remainder, try again
    if (value < maxAcceptable) {
      return (value % sides) + 1;
    }
  }
}
