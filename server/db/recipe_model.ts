import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Recipe as RecipeInterface } from '../../shared/recipe';

@Entity()
export default class Recipe implements RecipeInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;
}
