/**
 * Lambda that verifis if an object is of a given type.
 */
export type Predicate<T> = (x: any) => x is T;
/**
 * Lambda that build a new item of type T based on the provided item. The returned object should be
 * stripped of all extra properties. The lambda should also throw an error if there are any missing
 * fields or if the provided object fails some other custom validation.
 *
 * The provided propertyName is only for error message generation so it's easier to detect the exact
 * property that is failing validation.
 */
export type Sanitizer<T> = (x: any, propertyName: string) => T;

/**
 * Verifies that the provided object is an array where all of its elements satisfy the provieded
 * lambda.
 *
 * @param arrayCandidate - The object under question.
 * @param elementPredicate - The predicate that each element of the array must sastisfy.
 * @returns Whether or not `arrayCandidate` is an array where all its elements satisfy
 *          `elementPredicate`.
 */
export function isArray<T>(
  arrayCandidate: any,
  elementPredicate: Predicate<T>
): arrayCandidate is T[] {
  if (!Array.isArray(arrayCandidate)) {
    return false;
  }
  return arrayCandidate.every(elementPredicate);
}

/**
 * @param itemSanitizer - The sanitizer that should be applied to each element of the array.
 * @returns Sanitizer that returnss an array of items sanitized by the provied sanitizer.
 */
export function arraySanitizer<T>(itemSanitizer: Sanitizer<T>): Sanitizer<T[]> {
  return (arrayCandidate: any, arrayName: string) => {
    if (!Array.isArray(arrayCandidate)) {
      throw new Error(`Expected property "${arrayName}" to be of type array`);
    }
    const sanitizedArray: T[] = [];
    for (let i = 0; i < arrayCandidate.length; ++i) {
      sanitizedArray.push(itemSanitizer(arrayCandidate[i], `${arrayName}[${i}]`));
    }
    return sanitizedArray;
  };
}

export function sanitizeString(x: any, name: string): string {
  if (typeof x !== 'string') {
    throw new Error(`Expected property "${name}" to be of type string`);
  }
  // Since strings are immutable, we can just return x itself.
  return x;
}

export function sanitizeInteger(x: any, name: string): number {
  if (typeof x !== 'number' || !Number.isInteger(x)) {
    throw new Error(`Expected property "${name}" to be of type number (integer)`);
  }
  // Since numbers are immutable, we can just return x itself.
  return x;
}

export function sanitizePositiveInteger(x: any, name: string): number {
  x = sanitizeInteger(x, name);
  if (x <= 0) {
    throw new Error(`Expected property "${name}" to be of type number (positive integer)`);
  }
  // Since numbers are immutable, we can just return x itself.
  return x;
}
