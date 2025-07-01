const { Sequelize, DataTypes, Model } = require('sequelize');

// Initialize Sequelize with SQLite in-memory database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

class Author extends Model {}
Author.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'Author' });

class Book extends Model {}
Book.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { sequelize, modelName: 'Book' });

// Relationships
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

module.exports = { sequelize, Author, Book }; 