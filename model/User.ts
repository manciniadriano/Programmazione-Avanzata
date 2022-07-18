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
    }
  },
  {
    modelName: "users",
    timestamps: false,
  }
);

/**
 * funzione che cerca il budget dell'utente, cercando per email
 * @param email email dell'utente
 * @returns il suo budget
 */
export async function getBudget(email: string) {
  const budget = await User.findOne({
    attributes: ["budget"],
    where: { email: `${email}` },
  });
  return budget;
}

/**
 * funzione che vede se esiste un utente sulla base dell'email, ritornando l'oggetto user ritrovato.
 * @param email 
 * @returns oggetto user.
 */
export async function checkExistingUser(email: string) {
  const user = await User.findOne({
    attributes: ['email'],
    where: { email: email },
  });
  return user;
}

/**
 * funzione che aggiorna il budget dello user, cercando per email.
 * @param newBudget il nuovo budget da aggiungere
 * @param email l'email dell'utente
 */
export async function budgetUpdate(newBudget: Number, email: string) {
  const user = await User.update(
    {
      budget: newBudget,
    },
    {
      where: { email: `${email}` },
    }
  );
}