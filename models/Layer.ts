import {
    DataType,
    Model,
    Column,
    Table,
    Unique,
    AllowNull
} from "sequelize-typescript";

@Table({
  timestamps: true
})
export class Layer extends Model<Layer> {

  @Column(DataType.JSONB)
  clientConfig: any;

  @Column(DataType.JSONB)
  features: any;

  @Unique
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  sourceConfig: any;

  @AllowNull(false)
  @Column(DataType.ENUM('TileWMS', 'VectorTile', 'WFS', 'WMS', 'WMTS', 'XYZ'))
  type: 'TileWMS' | 'VectorTile'| 'WFS' | 'WMS' | 'WMTS' | 'XYZ'
}