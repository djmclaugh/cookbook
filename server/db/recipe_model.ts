import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Recipe } from '../../shared/recipe';

import RecipeIngredientRelationModel from './recipe_ingredient_relation_model';

@Entity()
@Unique(['title'])
export default class RecipeModel extends BaseEntity implements Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;

  @OneToMany(
    () => RecipeIngredientRelationModel,
    relation => relation.recipe,
    { cascade: true, eager: true },
  )
  ingredients!: RecipeIngredientRelationModel[];

  private ingredientsAtLoad: RecipeIngredientRelationModel[] = [];
  @AfterLoad()
  private sortIngredients() {
    if (this.ingredients) {
      this.ingredients.sort((a, b) => { return a.index - b.index });
      this.ingredientsAtLoad = this.ingredients.concat();
    }
  }

  // override
  // This makes the ingredient array "smart" as in it cascades deletion and index position.
  async save() {
    await RecipeModel.getRepository().manager.transaction(async transactionalEnitytManager => {
      if (this.ingredients) {
        for (const old of this.ingredientsAtLoad) {
          if (old.index >= this.ingredients.length || this.ingredients[old.index] != old) {
            console.log("removeing old: " + old.index);
            old.recipe = this;
            await transactionalEnitytManager.remove(old);
          }
        }
        for (let i = 0; i < this.ingredients.length; ++i) {
          if (this.ingredients[i].index !== i) {
            this.ingredients[i].index = i;
          }
        }
      }
      await transactionalEnitytManager.save(this);
      this.sortIngredients();
    });
    return this;
  }
}
