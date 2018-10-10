import {
    DataType,
    Model,
    Column,
    Table,
    Unique,
    AllowNull,
    DefaultScope,
    Scopes,
    BelongsToMany
} from "sequelize-typescript";
import UserGroup from "./UserGroup";
import User_UserGroup from "./belongsToMany/User_UserGroup";

@DefaultScope({
  attributes: {
    exclude: ['password']
  }
})
@Scopes({
  withPassword: {
    attributes: {}
  }
})
@Table({
  timestamps: true
})
export default class User extends Model<User> {

  @Column(DataType.JSONB)
  clientConfig: any;

  @Column(DataType.JSONB)
  details: any;

  @Column(DataType.JSONB)
  password: string;

  @Unique
  @AllowNull(false)
  @Column
  username: string;

  @BelongsToMany(() => UserGroup, () => User_UserGroup)
  usergroups: UserGroup[];
}
