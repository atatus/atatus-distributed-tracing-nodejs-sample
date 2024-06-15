import { DataTypes } from 'sequelize'
const CustomerTable = (sequelize) => {
  const CustomersTable = sequelize.define(
    'CUSTOMERS',
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      CUSTOMER_NAME: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ACCOUNT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      AMOUNT: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      STATUS: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'CUSTOMERS',
      timestamps: true,
      freezeTableName: true,
    }
  )
  return CustomersTable
}

export default CustomerTable
