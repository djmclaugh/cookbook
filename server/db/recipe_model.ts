import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Recipe, RecipeWithIngredients } from '../../shared/entities/recipe';

import RecipeIngredientRelationModel from './recipe_ingredient_relation_model';

@Entity()
@Unique(['title'])
export default class RecipeModel extends BaseEntity implements RecipeWithIngredients {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;

  @OneToMany(
    () => RecipeIngredientRelationModel,
    relation => relation.recipe,
    { cascade: true },
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

  // The return type is Recipe[] instead of RecipeMode[] since the ingredients are not fetched.
  static fetchAllRecipes(): Promise<Recipe[]> {
    return RecipeModel.find();
  }

  static async doesRecipeWithIdExist(id: number): Promise<boolean> {
    return await RecipeModel.findOne(id) !== undefined;
  }

  static fetchRecipeById(id: number): Promise<RecipeModel|undefined> {
    return RecipeModel.findOne(id, { relations: ['ingredients'] });
  }

  static async doesRecipeWithTitleExist(title: string): Promise<boolean> {
    return await RecipeModel.findOne({title: title}) !== undefined;
  }

  static fetchRecipeByTitle(title: string): Promise<RecipeModel|undefined> {
    return RecipeModel.findOne({ title: title }, { relations: ['ingredients'] });
  }
}
