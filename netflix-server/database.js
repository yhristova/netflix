import { Sequelize, DataTypes, } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  host: "/Users/yoanahristova/work/projects/netflix/netflix-server/netflixDB",
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

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    },
  },
);

sequelize.sync();
