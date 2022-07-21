// Eh, this is good enough.
function seedableRandom(seed) {
  var x = Math.sin(seed++) * 10000; 
  return x - Math.floor(x);
}

function seedableRandomBetween(start, end, seed) {
  return start + Math.round(seedableRandom(seed) * (end - start))
}

class SeedableRandom {
  constructor({ seed, min, max }) {
    this.seed = seed
    this.min = min
    this.max = max
  }

  getRandomInt() {
    const result = seedableRandomBetween(this.min, this.max, this.seed)
    this.seed = result
    return result
  }
}

export {
  seedableRandom,
  seedableRandomBetween,
  SeedableRandom
}