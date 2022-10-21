import { OneHotEncodedVector } from "./lsh-types";
import { MinHash } from "./minhash";

describe('MinHash', () => {
    it('should create MinHash instance', () => {
        // arrange
        const vocabulary = ['AES', 'DES', '3DES', 'Argon', 'ChaCha'];
        const HASH_FUNCTIONS_COUNT = 2;

        // act
        const minHash = new MinHash(vocabulary, HASH_FUNCTIONS_COUNT);

        // assert
        expect(minHash).toBeInstanceOf(MinHash);
    });

    it('should create MinHash instance', () => {
        // arrange
        const vocabulary = ['AES', 'DES', '3DES', 'Argon', 'ChaCha'];
        const HASH_FUNCTIONS_COUNT = 5;
        const minHash = new MinHash(vocabulary, HASH_FUNCTIONS_COUNT);
        const inputVector: OneHotEncodedVector = [1, 0, 1];

        // act
        const result = minHash.getSignature(inputVector);

        // assert
        expect(result).toBeTruthy();
        expect(result.length).toEqual(HASH_FUNCTIONS_COUNT);
    });
});