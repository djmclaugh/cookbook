import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { Quantity } from '../../shared/quantity';
import { QuantifiedIngredient } from '../../shared/recipe';

import RecipeModel from './recipe_model';
import IngredientModel from './ingredient_model';

@Entity()
export default class RecipeIngredientRelationModel extends BaseEntity implements QuantifiedIngredient {
  @PrimaryColumn()
  index!: number;

  @ManyToOne(
    type => RecipeModel,
    recipe => recipe.ingredients,
    { onDelete: 'CASCADE', nullable: false, primary: true },
  )
  recipe!: RecipeModel;

  @ManyToOne(
    type => IngredientModel,
    { eager: true, cascade: ['insert'], onDelete: 'RESTRICT', nullable: false },
  )
  ingredient!: IngredientModel;

  @Column()
  private amount: number = 1;

  @Column()
  private amountDenominator: number = 1;

  @Column('simple-array')
  private modifiers: string[] = [];

  @Column('text')
  private unit: string = '';

  // Access the amount, amountDenominator, modifiers, and unit fields through the quantity object.
  // This allows the model to conform to the shared QuantifiedIngredient interface.
  get quantity(): Quantity {
    const self = this;
    return {
      get amount() {
        return self.amount;
      },
      set amount(amount) {
        self.amount = amount;
      },
      get amountDenominator() {
        return self.amountDenominator;
      },
      set amountDenominator(denominator) {
        self.amountDenominator = denominator;
      },
      get modifiers() {
        return self.modifiers;
      },
      set modifiers(modifiers) {
        self.modifiers = modifiers;
      },
      get unit() {
        return self.unit;
      },
      set unit(unit) {
        self.unit = unit;
      },
    }
  }

  set quantity(quantity: Quantity) {
    this.amount = quantity.amount;
    this.amountDenominator = quantity.amountDenominator;
    this.modifiers = quantity.modifiers;
    this.unit = quantity.unit;
  }
}
