import {
    DataType,
    Model,
    Column,
    Table,
    Unique,
    AllowNull,
    Default
} from "sequelize-typescript";

@Table({
  timestamps: true
})
export default class Application extends Model<Application> {

  @Column(DataType.JSONB)
  clientConfig: any;

  @Column(DataType.JSONB)
  layerTree: any;

  @Column(DataType.JSONB)
  layerConfig: any;

  @Unique
  @AllowNull(false)
  @Column
  name: string;

  @Default(false)
  @Column
  stateOnly: boolean;

  @Column(DataType.JSONB)
  toolConfig: any;
}
