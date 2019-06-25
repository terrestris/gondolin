import {
    Model,
    Column,
    Table,
    Unique,
    AllowNull,
    BelongsToMany
} from 'sequelize-typescript';
import User from './User';
import User_UserGroup from './belongsToMany/User_UserGroup';

@Table({
  timestamps: true
})
export default class UserGroup extends Model<UserGroup> {

  @Unique
  @AllowNull(false)
  @Column
  name: string;

  @BelongsToMany(() => User, () => User_UserGroup)
  Users: User[];
}
