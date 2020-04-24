import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

import { Recipe } from '../../shared/recipe';

@Entity()
@Unique(['title'])
export default class RecipeModel extends BaseEntity implements Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;
}
