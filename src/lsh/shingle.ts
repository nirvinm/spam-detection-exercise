export function shingle(s: string, size: number): string[] {
  let result = new Set<string>(s.split(" ").map((k) => k.trim().toLowerCase()));
  // for (let i = 0; i < s.length; i += size) {
  //   result.add(s.substring(i, i + size).toLowerCase());
  // }
  return Array.from(result);
}

// build unique set of shingles from given possible duplicate shingles
export function buildVocabulary(shingles: string[][]): string[] {
  return Array.from(new Set(shingles.flat())); // array preserves the order of the vocabulary
}

// encode given shingles in an array such that the value 1 indicates the vocabulary
// is present in the shingles and 0 indicates the vocabulary not present.
export function oneHotEncode(shingles: string[], vocabulary: string[]) {
  const set = new Set(shingles); // for O(1) lookup in shingles
  return vocabulary.map((v) => (set.has(v) ? 1 : 0));
}
