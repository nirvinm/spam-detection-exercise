import {
  Band,
  Bucket,
  HashKey,
  Shingle,
  Signature,
  TextDocument,
  Vocabulary,
} from "./lsh-types";
import { MinHash } from "./minhash";
import { buildVocabulary, oneHotEncode, shingle } from "./shingle";

// Implementation of Locality Sensitive Hashing. Each instance might
// produce different values but it should still maintain relative probability with
// other documents.
export class LSH {
  private BUCKETS_COUNT;

  private documentBandsPair: [number, Band[]][];
  private buckets: Bucket[] = [];

  constructor(
    documents: TextDocument[],
    bucketsCount: number,
    hashFunctionsCount: number
  ) {
    // pre initialize buckets
    this.BUCKETS_COUNT = bucketsCount;
    this.initBuckets();

    // shingle and generate vocabulary from all documents
    const shingles = documents.map(shingle);
    const vocabulary = buildVocabulary(shingles);

    // need a MinHash instance to generate signatures
    const minHash = new MinHash(vocabulary, hashFunctionsCount);

    // generate signature for each document using the vocabulary and shingles
    const signatures = this.generateSignatures(
      documents,
      minHash,
      shingles,
      vocabulary
    );

    // for every document, divide each signature into multiple bands
    // of constant sized length.
    this.documentBandsPair = documents.map((_, i) => [
      i,
      this.generateBands(signatures[i]),
    ]);

    // take each row from each band and push it into the hashtable in the bucket
    this.documentBandsPair.forEach((pair) => {
      let [documentIndex, bands] = pair;
      for (let bandIndex = 0; bandIndex < bands.length; ++bandIndex) {
        this.addHash(bandIndex, bands[bandIndex], documentIndex);
      }
    });
  }

  // Gets possible candiates that are similar to given document.
  // This does not indicate strong correlation between the documents.
  // The caller must compute jaccard similarity or other scores in
  // order to determine how close the documents are.
  getSimilarDocuments(documentIndex: number) {
    const [_, bands] = this.documentBandsPair[documentIndex];
    const documents: number[][] = [];

    // filter all documents that share exact rows in any one of the
    // bands we generated.
    bands.forEach((row, i) => {
      const key = this.makeKey(row);
      if (this.buckets[i].has(key)) {
        documents.push(this.buckets[i].get(key) || []);
      }
    });

    // return set of unique document IDs that might be similar to given document
    return new Set<number>(documents.flat());
  }

  // enerate signaure for a document based on it's vocabulary by generating
  // one-hot encoded vector first and then shriking the vector into
  private generateSignatures(
    documents: TextDocument[],
    minHash: MinHash,
    shingles: Shingle[][],
    vocabulary: Vocabulary
  ): Signature[] {
    const signatures: Signature[] = [];
    for (let i = 0; i < documents.length; ++i) {
      signatures.push(
        minHash.getSignature(oneHotEncode(shingles[i], vocabulary))
      );
    }
    return signatures;
  }


  // Splits the signature of a document into multiple bands
  private generateBands(signature: Signature): Band[] {
    if (signature.length % this.BUCKETS_COUNT != 0) {
      throw new Error(
        "signature length must be divisible by number of buckets."
      );
    }

    const rows = signature.length / this.BUCKETS_COUNT;
    const bands: Band[] = [];
    for (let i = 0; i < signature.length; i += rows) {
      bands.push(signature.slice(i, i + rows));
    }
    return bands;
  }

  // Adds a document to the bucket in the given band using the given row as the key.
  private addHash(bandIndex: number, bandRow: Band, documentId: number) {
    const key = this.makeKey(bandRow);
    if (!this.buckets[bandIndex].has(key)) {
      this.buckets[bandIndex].set(key, []);
    }
    this.buckets[bandIndex].get(key)?.push(documentId);
  }

  // Generates key for use in hash-table from given band row
  private makeKey(bandRow: Band): HashKey {
    return bandRow.join(",");
  }

  // Creates empty buckets of length BUCKETS_COUNT configured with hash table initialized
  // in each bucket.
  private initBuckets() {
    for (let i = 0; i < this.BUCKETS_COUNT; ++i)
      this.buckets[i] = new Map<string, number[]>();
  }
}
