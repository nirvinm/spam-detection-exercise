// Randomize the given array.
// Courtesy: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Compute union of two sets. Duplicates are not preserved.
export function union<T>(x: T[], y: T[]) {
  let a = new Set(x);
  let b = new Set(y);
  let union = new Set([...a, ...b]);
  return union;
}

// Compute intersection between two sets. Duplicates are not preserved.
export function intersection<T>(x: T[], y: T[]) {
  let a = new Set(x);
  let b = new Set(y);
  let intersection = new Set([...a].filter((x) => b.has(x)));
  return intersection;
}

// Compute jaccard similarity between two sets.
// Higher value represents higher similarity.
export function jaccard<T>(a: T[], b: T[]) {
  return intersection(a, b).size / union(a, b).size;
}
