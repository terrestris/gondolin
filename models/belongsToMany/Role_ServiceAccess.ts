import {
  Model,
  Table,
  ForeignKey,
  Column
} from "sequelize-typescript";
import Role from "../Role";
import ServiceAccess from "../ServiceAccess";

@Table
export default class Role_ServiceAccess extends Model<Role_ServiceAccess> {

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @ForeignKey(() => ServiceAccess)
  @Column
  serviceAccessId: number;
}
