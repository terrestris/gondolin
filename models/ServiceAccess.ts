import {
    Model,
    Column,
    Table,
    AllowNull,
    BelongsToMany,
    DataType
} from "sequelize-typescript";
import { Role } from "./Role";
import { Role_ServiceAccess } from "./belongsToMany/Role_ServiceAccess";

@Table({
  timestamps: true
})
export class ServiceAccess extends Model<ServiceAccess> {

  @AllowNull(false)
  @Column(DataType.ENUM('REQUEST', 'RESPONSE'))
  event: 'REQUEST' | 'RESPONSE'

  @AllowNull(false)
  @Column
  operation: string

  @AllowNull(false)
  @Column(DataType.ENUM('WMS', 'WFS', 'WCS'))
  service: 'WMS' | 'WFS' | 'WCS'

  @AllowNull(false)
  @Column(DataType.ENUM('ALLOW', 'DENY', 'MODIFY'))
  type: 'ALLOW' | 'DENY'| 'MODIFY'

  @BelongsToMany(() => Role, () => Role_ServiceAccess)
  roles: Role[];
}