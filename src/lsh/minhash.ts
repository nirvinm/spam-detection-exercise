import { shuffle } from "../lib/Array";
import {
  HashFunction,
  OneHotEncodedVector,
  Signature,
  Vocabulary,
} from "./lsh-types";

// A MinHash implementation for use in LSH. Provides functions
// to generate signature for an one-hot encoded document. Each
// instance generates unique set of hash functions, so the same
// instance should be used across all documents.
export class MinHash {
  private HASH_FUNCTIONS_COUNT;
  private hashFunctions: HashFunction[] = [];
  private vocabulary: Vocabulary;

  constructor(vocabulary: Vocabulary, hashFunctionsCount: number) {
    this.HASH_FUNCTIONS_COUNT = hashFunctionsCount;
    this.vocabulary = vocabulary;
    for (let i = 0; i < this.HASH_FUNCTIONS_COUNT; ++i) {
      this.hashFunctions.push(this.generateHashFunction());
    }
  }

  // Shrinks the given one-hot encoded vector into a signature by 
  // using randomly generated hash functions.
  getSignature = (oneHotEncodedVector: OneHotEncodedVector): Signature => {
    const signature: number[] = [];
    this.hashFunctions.forEach((hashFn) => {
      for (let i = 0; i < this.vocabulary.length; ++i) {
        const index = hashFn[i];
        if (oneHotEncodedVector[index] == 1) {
          signature.push(index);
          break;
        }
      }
    });
    return signature;
  };

  // Generates a hash function which is vector of random numbers of range
  // 0...n where n is the length of vocabulary. Each call to this function
  // produces a new random hash function.
  private generateHashFunction = (): HashFunction => {
    return shuffle([...Array(this.vocabulary.length).keys()]);
  };
}
