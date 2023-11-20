import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  host: "/Users/yoanahristova/work/projects/netflix-server/MOVIES",
});

export const Movie = sequelize.define("Movie", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  movie_name: {
    type: DataTypes.STRING,
  },
  movie_src: {
    type: DataTypes.STRING,
  },
});

sequelize.sync();
