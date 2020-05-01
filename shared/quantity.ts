import { arraySanitizer, isArray, sanitizePositiveInteger, sanitizeString } from './util';

export interface Quantity {
  amount: number, // Must be whole and positive number
  amountDenominator: number, // Must be whole, positive value
  modifiers: string[], // ex: large, heaping, packed...
  unit: string, // ex: tsp, kg, clove, or empty string for unitless like "3 potatoes"
}

function isString(x: any): x is string {
  return typeof x === 'string';
}

export function isQuantity(x: any): x is Quantity {
  return typeof x.amount === 'number'
    && typeof x.amountDenominator === 'number'
    && isArray(x.modifiers, isString)
    && typeof x.unit === 'string';
}

const sanitizeStringArray = arraySanitizer(sanitizeString);

export function sanitizeQuantity(x: any, name: string): Quantity {
  return {
    amount: sanitizePositiveInteger(x.amount, name + '.amount'),
    amountDenominator: sanitizePositiveInteger(x.amountDenominator, name + '.amountDenominator'),
    modifiers: sanitizeStringArray(x.modifiers, name + '.modifiers'),
    unit: sanitizeString(x.unit, name + '.unit'),
  };
}
