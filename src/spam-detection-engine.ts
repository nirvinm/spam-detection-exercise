import {
  HASH_FUNCTIONS_COUNT,
  LSH_BUCKET_SIZE,
  MIN_SIMILARITY,
} from "../config";
import { jaccard } from "./lib/array";
import { LSH } from "./lsh/lsh";
import { TextDocument } from "./lsh/lsh-types";
import { shingle } from "./lsh/shingle";

// Spam Detection Engine based on Locality Sensitive Hashing
export class SpamDetectionEngine {
  lsh: LSH;
  emails: string[];

  constructor(emails: string[]) {
    if (emails.length < 2) {
      throw new Error('atleast two documents are required.');
    }
    this.emails = emails;
    this.lsh = new LSH(emails, LSH_BUCKET_SIZE, HASH_FUNCTIONS_COUNT);
  }

  // Computes spam probability for a given email.
  // The algorithm is as follows
  //  1. Build LSH from given email documents.
  //  2. Query LSH for possible candiates based on collisions of shingles (signature)
  //  3. For each candidate, compute jaccard similarity between the given query email and candiate email document
  //  4. Filter all high similarity documents
  //  5. Return probability (matching emails / total emails)
  spamProbability(emailIndex: number) {
    // get all candidate emails that are similar to the given email.
    // these are may or may not be closely matching with given email.
    const matchingEmails = Array.from(this.lsh.getSimilarDocuments(emailIndex));
    const queryEmail = this.emails[emailIndex];
    const closestEmails: number[] = this.filterClosestEmails(
      queryEmail,
      matchingEmails
    );
    return closestEmails.length / this.emails.length; // probability is closely matching emails / total emails in the set
  }

  // Get all emails that are closesly similar to given email.
  // It works by splitting emails into shingles and computing jaccard
  // similarity (shingles(A) intersection shingles(B))
  private filterClosestEmails(queryEmail: TextDocument, candidateEmailsIndex: number[]) {
    // let's generate shingles for the given email to compare with shingles from candidate emails.
    const queryShingles = shingle(queryEmail);

    const result: number[] = [];
    candidateEmailsIndex.forEach((candidateDocumentIndex) => {
      // compute jaccard similarity between the given email's shingles and current candidate's email shingles
      const candidateShingles = shingle(this.emails[candidateDocumentIndex]);
      const probability = jaccard(queryShingles, candidateShingles);

      // if similarity is equal or greater than configured MIN_SIMILARITY, consider this is a close match
      if (probability >= MIN_SIMILARITY) result.push(candidateDocumentIndex);
    });
    return result;
  }
}
