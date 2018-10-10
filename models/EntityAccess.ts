import {
    Model,
    Column,
    Table,
    AllowNull,
    ForeignKey,
    BelongsTo,
    BelongsToMany
} from "sequelize-typescript";
import Role from "./Role";
import EntityOperation from "./EntityOperation";
import Role_EntityAccess from "./belongsToMany/Role_EntityAccess";

@Table({
  timestamps: true
})
export default class EntityAccess extends Model<EntityAccess> {

  @AllowNull(false)
  @Column
  entity: number;

  @ForeignKey(() => EntityOperation)
  @AllowNull(false)
  @Column
  entityOperationId: number;

  @BelongsTo(() => EntityOperation)
  entityOperation: EntityOperation;

  @BelongsToMany(() => Role, () => Role_EntityAccess)
  roles: Role[];
}
