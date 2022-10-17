import { MinHash } from "./minhash";
import { buildVocabulary, oneHotEncode, shingle } from "./shingle";

// Locality Sensitive Hashing
export class LSH {
  private BUCKETS_COUNT;

  private documentBandsPair: [number, number[][]][];
  private buckets: Map<string, number[]>[] = [];

  constructor(
    documents: string[],
    bucketsCount: number,
    hashFunctionsCount: number,
    shingleSize: number
  ) {
    this.BUCKETS_COUNT = bucketsCount;
    this.initBuckets();

    const shingles = documents.map((s) => shingle(s, shingleSize));
    const vocabulary = buildVocabulary(shingles);
    const minHash = new MinHash(vocabulary, hashFunctionsCount);
    const signatures: number[][] = [];
    for (let i = 0; i < documents.length; ++i) {
      signatures.push(
        minHash.getSignature(oneHotEncode(shingles[i], vocabulary))
      );
    }
    this.documentBandsPair = documents.map((d, i) => [
      i,
      this.generateBands(signatures[i]),
    ]);

    this.documentBandsPair.forEach((pair: any) => {
      let [d, bands] = pair;
      for (let i = 0; i < bands.length; ++i) {
        this.addHash(i, bands[i], d);
      }
    });
  }

  // gets possible candiates that are similar to given document.
  // this does not indicate strong correlation between the documents.
  // the consumer must compute jaccard similarity or other scores in
  // order to determine how close the documents are.
  getSimilarDocuments(documentIndex: number) {
    const [_, bands] = this.documentBandsPair[documentIndex];
    const documents: number[][] = [];
    bands.forEach((row, i) => {
      const key = row.join(",");
      if (this.buckets[i].has(key)) {
        documents.push(this.buckets[i].get(key) || []);
      }
    });
    return new Set<number>(documents.flat());
  }

  private generateBands(signature: number[]) {
    if (signature.length % this.BUCKETS_COUNT != 0) {
      throw new Error(
        "signature length must be divisible by number of buckets."
      );
    }

    const rows = signature.length / this.BUCKETS_COUNT;
    const result: number[][] = [];
    for (let i = 0; i < signature.length; i += rows) {
      result.push(signature.slice(i, i + rows));
    }
    return result;
  }

  private addHash(bandIndex: number, bandRow: number[], documentId: number) {
    const key = bandRow.join(",");
    if (!this.buckets[bandIndex].has(key)) {
      this.buckets[bandIndex].set(key, []);
    }
    this.buckets[bandIndex].get(key)?.push(documentId);
  }

  private initBuckets() {
    for (let i = 0; i < this.BUCKETS_COUNT; ++i)
      this.buckets[i] = new Map<string, number[]>();
  }
}
