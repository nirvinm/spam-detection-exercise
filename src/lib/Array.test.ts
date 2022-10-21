import { jaccard, shuffle } from "./Array";

describe("Array", () => {
  describe("shuffle", () => {
    it("should randomize given array", () => {
      const input = [1, 2, 3, 4, 5, 6];
      const result = shuffle(input);

      expect(result).not.toEqual(input);
      expect(result.length).toEqual(input.length);
    });

    it("should randomize array with single element", () => {
      const input = ["a"];
      const result = shuffle(input);

      expect(result).toEqual(input);
      expect(result.length).toEqual(input.length);
    });

    it("should randomize empty array", () => {
      const input = [];
      const result = shuffle(input);

      expect(result).toEqual(input);
      expect(result.length).toEqual(input.length);
    });
  });

  describe("jaccard", () => {
    it('should compute similarity between two sets', () => {
        // arrange
        const set1 = ['AES', 'DES', 'ChaCha', 'Argon'];
        const set2 = ['Argon'];
        const expected = 1 / 4;
        // act
        const score = jaccard(set1, set2);
        // assert
        expect(score).toEqual(expected);
    });

    it('should compute similarity a set and an empty set', () => {
        // arrange
        const set1 = ['AES', 'DES', 'ChaCha', 'Argon'];
        const set2 = [];
        const expected = 0 / 4;
        // act
        const score = jaccard(set1, set2);
        // assert
        expect(score).toEqual(expected);
    });
  });
});
