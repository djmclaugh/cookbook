import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;
}
