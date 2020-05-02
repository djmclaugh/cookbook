import { arraySanitizer, sanitizePositiveInteger, sanitizeString } from '../util';

export interface Quantity {
  amount: number, // Must be whole and positive number
  amountDenominator: number, // Must be whole, positive value
  modifiers: string[], // ex: large, heaping, packed...
  unit: string, // ex: tsp, kg, clove, or empty string for unitless like "3 potatoes"
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
