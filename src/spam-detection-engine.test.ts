import { SpamDetectionEngine } from "./spam-detection-engine";

describe("SpamDetectionEngine", () => {
  it("should create instance", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "Give every man thy ear, but few thy voice.",
    ];
    // act
    const instance = new SpamDetectionEngine(input);
    // assert
    expect(instance).toBeInstanceOf(SpamDetectionEngine);
  });

  it("should not create instance with less than two documents", () => {
    // arrange
    const input = ["Give every man thy ear, but few thy voice."];
    // act & assert
    expect(() => new SpamDetectionEngine(input)).toThrow(
      "atleast two documents are required."
    );
  });

  it("should return less probability for an email that's not similar to others", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "Give every man thy ear, but few thy voice.",
    ];
    // act
    const instance = new SpamDetectionEngine(input);
    const spamProbability = instance.spamProbability(0);
    // assert
    expect(spamProbability).toBeLessThanOrEqual(0.5);
  });

  it("should return higher probability for an email that's similar to multiple emails in the input", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "dumpty humpty sat on neighbour's wall",
      "Give every man thy ear, but few thy voice.",
    ];
    // act
    const instance = new SpamDetectionEngine(input);
    const spamProbability = instance.spamProbability(1);
    // assert
    expect(spamProbability).toBeGreaterThanOrEqual(0.5);
  });

  it("should return higher probability for an email that's similar to all emails in the input", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "dumpty humpty sat on neighbour's wall",
      "humpty dumpty was not sitting on the wall but neighbours",
    ];
    // act
    const instance = new SpamDetectionEngine(input);
    const spamProbability = instance.spamProbability(2);
    // assert
    expect(spamProbability).toBeGreaterThanOrEqual(0.5);
  });

  it("should not claim an email as spam email if it is not closely similar to other emails", () => {
    // arrange
    const input = [
      "humpty dumpty sat on a wall",
      "dumpty went to festival yesterday and met humpty",
      "humpty likes children so much that she gives candy them",
      "children really love dumpty for her charming smile",
    ];
    // act
    const instance = new SpamDetectionEngine(input);
    const spamProbability = instance.spamProbability(0);
    // assert
    expect(spamProbability).toBeLessThanOrEqual(0.5);
  });
});
