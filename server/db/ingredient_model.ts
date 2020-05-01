import { BaseEntity, Column, Entity, In, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export default class IngredientModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  /**
   * @param names - The names of the ingredients to fetch or create
   * @param saveNewlyCreateIngredients - Whether or not newly created IngredientModels should be
   *                                     saved. This defaults to false, since ingredients are mostly
   *                                     used in relations with cascade on, so they will be saved
   *                                     anyway when their parent entity is saved.
   */
  static async getOrCreate(
    names: string[],
    saveNewlyCreateIngredients: boolean = false
  ): Promise<Map<string, IngredientModel>> {
    const results: Map<string, IngredientModel> = new Map();

    const foundIngredients = await IngredientModel.find({name: In(names)});
    for (const ingredient of foundIngredients) {
      results.set(ingredient.name, ingredient);
    }

    const ingredientsCreated: IngredientModel[] = [];
    for (const name of names) {
      if (!results.has(name)) {
        const newIngredient = new IngredientModel();
        newIngredient.name = name;
        ingredientsCreated.push(newIngredient);
        results.set(name, newIngredient);
      }
    }

    if (saveNewlyCreateIngredients) {
      await IngredientModel.save(ingredientsCreated);
    }

    return results;
  }
}
