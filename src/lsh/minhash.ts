import { shuffle } from "../lib/Array";

// A MinHash implementation for use in LSH.
export class MinHash {
  private HASH_FUNCTIONS_COUNT;
  private hashFunctions: number[][] = [];
  private vocabulary: string[];

  constructor(vocabulary: string[], hashFunctionsCount: number) {
    this.HASH_FUNCTIONS_COUNT = hashFunctionsCount;
    this.vocabulary = vocabulary;
    for (let i = 0; i < this.HASH_FUNCTIONS_COUNT; ++i) {
      this.hashFunctions.push(this.generateHashFunction());
    }
  }

  private generateHashFunction = () => {
    return shuffle([...Array(this.vocabulary.length).keys()]);
  };

  getSignature = (oneHotEncodedVector: number[]) => {
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
}
