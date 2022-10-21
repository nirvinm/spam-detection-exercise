// configures number of buckets in LSH
export const LSH_BUCKET_SIZE = 50;
// configures number of hash functions to generate in LSH
export const HASH_FUNCTIONS_COUNT = 100;
// minimum similarity score for an email to be considered related to another email
// this indicates atleast 10% of the words should be in common between two candiate emails
// very relative to the input set
export const MIN_SIMILARITY = 0.1;
