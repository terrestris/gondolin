import {
  Model,
  Table,
  ForeignKey,
  Column
} from "sequelize-typescript";
import { UserGroup } from "../UserGroup";
import { User } from "../User";

@Table
export class User_UserGroup extends Model<User_UserGroup> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => UserGroup)
  @Column
  userGroupId: number;
}