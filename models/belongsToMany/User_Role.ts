import {
  Model,
  Table,
  ForeignKey,
  Column
} from 'sequelize-typescript';
import User from '../User';
import Role from '../Role';

@Table
export default class User_Role extends Model<User_Role> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;
}
