import { buildVocabulary, oneHotEncode, shingle } from "./shingle";

describe("shingle", () => {
  describe("shingle", () => {
    it("should extract words from a text document", () => {
      // arrange
      const input = "humpty dumpty, sat on a wall!";
      // act
      const result = shingle(input);
      // assert
      const expected = ["humpty", "dumpty,", "sat", "on", "a", "wall!"];
      expect(result).toEqual(expected);
    });

    it("should convert capitalized words into lowercase", () => {
      // arrange
      const input = "Humpty Dumpty Sat on a WALL.";
      // act
      const result = shingle(input);
      // assert
      const expected = ["humpty", "dumpty", "sat", "on", "a", "wall."];
      expect(result).toEqual(expected);
    });

    it("should ignore extra spaces between words", () => {
      // arrange
      const input = "humpty    dumpty sat on     a   wall";
      // act
      const result = shingle(input);
      // assert
      const expected = ["humpty", "dumpty", "sat", "on", "a", "wall"];
      expect(result).toEqual(expected);
    });

    it("should trim words", () => {
      // arrange
      const input = "   humpty    ";
      // act
      const result = shingle(input);
      // assert
      const expected = ["humpty"];
      expect(result).toEqual(expected);
    });

    it("should not crash with empty string", () => {
      // arrange
      const input = "";
      // act
      const result = shingle(input);
      // assert
      const expected = [];
      expect(result).toEqual(expected);
    });

    it("should not crash with spaces", () => {
      // arrange
      const input = "   ";
      // act
      const result = shingle(input);
      const expected = [];
      // assert
      expect(result).toEqual(expected);
    });
  });

  describe("buildVocabulary", () => {
    it("should return unique set of words from multiple documents", () => {
      // arrange
      const input = [
        shingle(
          "A digital signature is a mathematical scheme for verifying the authenticity of digital messages or documents."
        ),
        shingle(
          "A valid digital signature, where the prerequisites are satisfied, gives a recipient very high confidence that the message was created by a known sender (authenticity), and that the message was not altered in transit (integrity)."
        ),
      ];

      const expected = [
        "a",
        "digital",
        "signature",
        "is",
        "mathematical",
        "scheme",
        "for",
        "verifying",
        "the",
        "authenticity",
        "of",
        "messages",
        "or",
        "documents.",
        "valid",
        "signature,",
        "where",
        "prerequisites",
        "are",
        "satisfied,",
        "gives",
        "recipient",
        "very",
        "high",
        "confidence",
        "that",
        "message",
        "was",
        "created",
        "by",
        "known",
        "sender",
        "(authenticity),",
        "and",
        "not",
        "altered",
        "in",
        "transit",
        "(integrity).",
      ];

      // act
      const result = buildVocabulary(input);
      // assert
      expect(result.sort()).toMatchObject(expected.sort());
    });

    it("should return unique set of words from other document if one document is empty", () => {
      // arrange
      const input = [shingle(""), shingle("abc")];
      const expected = ["abc"];
      // act
      const result = buildVocabulary(input);
      // assert
      expect(result.sort()).toMatchObject(expected.sort());
    });

    it("should return empty set if both documents are empty", () => {
      // arrange
      const input = [shingle(""), shingle("")];
      const expected = [];
      // act
      const result = buildVocabulary(input);
      // assert
      expect(result.sort()).toMatchObject(expected.sort());
    });
  });

  describe("oneHotEncode", () => {
    it("should encode given shingles against the vocabulary", () => {
      // arrange
      const shingles = ["c", "a"];
      const vocabulary = ["a", "b", "c", "d"];
      // act
      const result = oneHotEncode(shingles, vocabulary);
      // assert
      const expected = [1, 0, 1, 0];
      expect(result).toEqual(expected);
    });

    it("should return all 1s if no shingles are present against the vocabulary", () => {
      // arrange
      const shingles = [];
      const vocabulary = ["a", "b", "c", "d"];
      // act
      const result = oneHotEncode(shingles, vocabulary);
      // assert
      const expected = [0, 0, 0, 0];
      expect(result).toEqual(expected);
    });

    it("should return all 1s if all shingles are present in the vocabulary", () => {
      // arrange
      const shingles = ["d", "c", "a", "b"];
      const vocabulary = ["a", "b", "c", "d"];
      // act
      const result = oneHotEncode(shingles, vocabulary);
      // assert
      const expected = [1, 1, 1, 1];
      expect(result).toEqual(expected);
    });
  });
});
