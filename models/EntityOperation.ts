import {
    DataType,
    Model,
    Column,
    Table,
    AllowNull
} from "sequelize-typescript";

@Table({
  timestamps: true
})
export class EntityOperation extends Model<EntityOperation> {

  @AllowNull(false)
  @Column(DataType.ENUM('ADMIN', 'CREATE', 'READ', 'UPDATE', 'DELETE'))
  operation: 'ADMIN' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
}