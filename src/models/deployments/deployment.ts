// export default function (sequelize: any, DataTypes: any): any {
//   const Deployment = sequelize.define('Deployment', {
//     id: {
//       type: DataTypes.STRING(16),
//       allowNull: false,
//       primaryKey: true
//     },
//     streamId: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     deploymentType: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     deployedAt: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false
//     },
//     createdById: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   },
//   {
//     underscored: true,
//     paranoid: true
//   })

//   Deployment.attributes = {
//     full: ['id', 'created_at', 'deployed_at', 'updated_at', 'deleted_at', 'deployment_type', 'is_active', 'created_by_id', 'stream_id'],
//     lite: ['id', 'device', 'is_active']
//   }

//   return Deployment
// }
import { Table, Column, Model, HasMany } from 'sequelize-typescript'

@Table
export class Deployment extends Model<Deployment> {
  
}