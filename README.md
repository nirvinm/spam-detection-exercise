# spam-detection-exercise

A spam detection engine based on Locality Sensitive Hashing to cluster similar email texts. The more the emails, the better the probability value is.

## Algorithm

1. Build LSH (Locality Sensivtive Hashing) instance from given email documents.
2. For a select email, query LSH for possible similar candidates based on collisions of shingles (signature)
3. For each candidate, compute jaccard similarity between the given query email and candiate email
4. Filter all highly similar documents
5. Return probability (matching emails / total emails)

## Prerequisites

NodeJS 14 or 16

## Install dependencies

    $ npm install

## Running

    $ npx ts-node main.ts

## Input

You can give email texts in `example-input.ts` file as an array of strings.

