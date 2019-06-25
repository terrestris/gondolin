import {
    Model,
    Column,
    Table,
    Unique,
    AllowNull,
    BelongsToMany,
    BelongsTo,
    ForeignKey
} from 'sequelize-typescript';
import User from './User';
import User_Role from './belongsToMany/User_Role';
import UserGroup from './UserGroup';

@Table({
  timestamps: true
})
export default class Role extends Model<Role> {

  @Unique
  @AllowNull(false)
  @Column
  name: string;

  @ForeignKey(() => UserGroup)
  @AllowNull(false)
  @Column
  userGroupId: number;

  @BelongsTo(() => UserGroup)
  userGroup: UserGroup;

  @BelongsToMany(() => User, () => User_Role)
  Roles: Role[];
}
