import {
  OneHotEncodedVector,
  Shingle,
  TextDocument,
  Vocabulary,
} from "./lsh-types";

// Generate shingles from the given text document. Shingles
// are individual words extracted, spaces removed and converted to lower case.
// Note: The shingles are not constant sized.
export function shingle(s: TextDocument): Shingle[] {
  let result = new Set<string>(s.split(" ").map((k) => k.trim().toLowerCase()));
  return Array.from(result);
}

// Build unique set of shingles from given possible duplicate shingles
export function buildVocabulary(shingles: Shingle[][]): Vocabulary {
  return Array.from(new Set(shingles.flat())); // array preserves the order of the vocabulary
}

// Encode given shingles in an array such that the value 1 indicates the vocabulary
// is present in the shingles and 0 indicates the vocabulary not present.
export function oneHotEncode(
  shingles: Shingle[],
  vocabulary: Vocabulary
): OneHotEncodedVector {
  const set = new Set(shingles); // for O(1) lookup in shingles
  return vocabulary.map((v) => (set.has(v) ? 1 : 0));
}
