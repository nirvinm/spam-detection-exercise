import { assert } from "console";
import { HASH_FUNCTIONS_COUNT, LSH_BUCKET_SIZE } from "../../config";
import { LSH } from "./lsh";

describe("LSH", () => {
  it("should create LSH instance", () => {
    // arrange
    const input = ["humpty dumpty sat on a wall"];
    // act
    const lsh = new LSH(input, LSH_BUCKET_SIZE, HASH_FUNCTIONS_COUNT);
    // assert
    expect(lsh).toBeInstanceOf(LSH);
  });

  it("should not create LSH instance if hash functions count is not divisible by bucket size", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "Give every man thy ear, but few thy voice.",
      "We know what we are, but know not what we may be.",
    ];

    // act & assert
    expect(() => new LSH(input, 3, 10)).toThrowError();
  });

  it("should get similar documents", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "Give every man thy ear, but few thy voice.",
      "humpty dumpty might have been sat on a wall",
      "We know what we are, but know not what we may be.",
      "someone sat on a wall who was humpty dumpty",
    ];
    const lsh = new LSH(input, LSH_BUCKET_SIZE, HASH_FUNCTIONS_COUNT);
    // act
    const result = lsh.getSimilarDocuments(0);
    const cadidateDocuments = Array.from(result).map((i) => input[i]);
    // assert
    expect(cadidateDocuments.sort()).toEqual([
      "humpty dumpty might have been sat on a wall",
      "humpty dumpty sat on a wall",
      "someone sat on a wall who was humpty dumpty",
    ]);
  });

  it("should get atleast given document if nothing matches", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "Give every man thy ear, but few thy voice.",
      "We know what we are, but know not what we may be.",
    ];
    const lsh = new LSH(input, LSH_BUCKET_SIZE, HASH_FUNCTIONS_COUNT);
    // act
    const result = lsh.getSimilarDocuments(0);
    const cadidateDocuments = Array.from(result).map((i) => input[i]);
    // assert
    expect(cadidateDocuments.sort()).toEqual(["humpty dumpty sat on a wall"]);
  });

  it("should return all documents if all of them are similar", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "humpty dumpty might have been sat on a wall",
      "someone sat on a wall who was humpty dumpty",
    ];
    const lsh = new LSH(input, LSH_BUCKET_SIZE, HASH_FUNCTIONS_COUNT);
    // act
    const result = lsh.getSimilarDocuments(0);
    const cadidateDocuments = Array.from(result).map((i) => input[i]);
    // assert
    expect(cadidateDocuments.sort()).toEqual([
      "humpty dumpty might have been sat on a wall",
      "humpty dumpty sat on a wall",
      "someone sat on a wall who was humpty dumpty",
    ]);
  });
});
