import { DataTypes, Model, Sequelize } from "sequelize";
import { SingletonDB } from "../model/Database";

const sequelize = SingletonDB.getInstance().getConnection();

const User = sequelize.define(
  "users",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "users",
    timestamps: false
  }
);

export async function getBudget(email: string) {
  const budget = await User.findOne({
    attributes: ["budget"],
    where: { email: `${email}` },
  });
  return budget;
}

export async function checkExistingUser(email: string) {
    const user = await User.findOne({
        attributes: ["email"],
        where: { email: `${email}` },
      });
      return user;
}

export async function budgetUpdate(newBudget: Number, email: string) {
  const user = await User.update(
    {
      budget : newBudget,
    }, 
    {
      where: {email : `${email}`},
    }
    );
}
