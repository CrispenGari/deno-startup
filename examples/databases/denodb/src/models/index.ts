import {
  ModelDefaults,
  ModelFields,
} from "https://deno.land/x/denodb@v1.3.0/lib/model.ts";
import {
  Model,
  DataTypes,
  Relationships,
} from "https://deno.land/x/denodb@v1.3.0/mod.ts";

export class User extends Model {
  static table = "users";
  static fields: ModelFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  };
  static todos() {
    return this.hasMany(Todo);
  }
  static defaults: ModelDefaults = {
    loggedIn: false,
  };
  static timestamps = true;
}

export class Todo extends Model {
  static table = "todo";
  static fields: ModelFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
  };
  static user() {
    return this.hasOne(User);
  }
  static defaults: ModelDefaults = {
    completed: false,
  };
  static timestamps = true;
}

Relationships.belongsTo(Todo, User);
