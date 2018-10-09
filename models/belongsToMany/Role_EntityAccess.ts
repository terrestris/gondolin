import {
  Model,
  Table,
  ForeignKey,
  Column
} from "sequelize-typescript";
import { Role } from "../Role";
import { EntityAccess } from "../EntityAccess";

@Table
export class Role_EntityAccess extends Model<Role_EntityAccess> {

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @ForeignKey(() => EntityAccess)
  @Column
  entityAccessId: number;
}