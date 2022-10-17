import { HASH_FUNCTIONS_COUNT, LSH_BUCKET_SIZE, SHINGLE_SIZE } from "../config";
import { jaccard } from "./lib/Array";
import { LSH } from "./lsh/lsh";
import { shingle } from "./lsh/shingle";

// Spam Detection based on Locality Sensitive Hashing
export class SpamDetectionEngine {
  lsh: LSH;
  emails: string[];

  constructor(emails: string[]) {
    this.emails = emails;
    this.lsh = new LSH(
      emails,
      LSH_BUCKET_SIZE,
      HASH_FUNCTIONS_COUNT,
      SHINGLE_SIZE
    );
  }

  // computes spam probability for a given email.
  // the algorithm is as follows
  //  1. Build LSH from given email documents.
  //  2. Query LSH for possible candiates based on collisions of shingles (signature)
  //  3. For each candidate, compute jaccard similarity between the given query email and candiate email document
  //  4. Filter all high similarity documents
  //  5. Return probability (matching emails / total emails)
  spamProbability(emailIndex: number) {
    const matchingDocuments = Array.from(
      this.lsh.getSimilarDocuments(emailIndex)
    );
    const queryEmail = this.emails[emailIndex];
    const queryShingles = shingle(queryEmail, SHINGLE_SIZE);

    const result: number[] = [];
    matchingDocuments.forEach((candidateDocumentIndex) => {
      const candidateShingles = shingle(this.emails[emailIndex], SHINGLE_SIZE);
      var probability = jaccard(queryShingles, candidateShingles);
      if (probability > 0.8) result.push(candidateDocumentIndex);
    });

    return result.length / this.emails.length;
  }
}
