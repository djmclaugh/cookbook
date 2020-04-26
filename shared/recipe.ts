export interface RecipeDraft {
  title: string,
}

export interface Recipe extends RecipeDraft {
  readonly id: number,
}

export function isRecipeDraft(x: any): x is RecipeDraft {
  return typeof x.title === 'string';
}

export function sanitizeRecipeDraft(x: any): RecipeDraft {
  if (typeof x.title !== 'string') {
    throw new Error('Expected property "title" of type "string"');
  }
  return {
    title: x.title,
  };
}

export function isRecipe(x: any): x is Recipe {
  return typeof x.id === 'number' && isRecipeDraft(x);
}

export function sanitizeRecipe(x: any): Recipe {
  const draft = sanitizeRecipeDraft(x);
  if (typeof x.id !== 'number' || !Number.isInteger(x.id)) {
    throw new Error('Expected property "id" of type "number (integer)"');
  }
  return {
    id: x.id,
    title: draft.title,
  };
}
