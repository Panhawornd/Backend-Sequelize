const { sequelize, Author, Book } = require('./models');

async function main() {
  await sequelize.sync({ force: true });

  // Q2: Create sample data
  const authors = await Author.bulkCreate([
    { name: 'Ronan The Best', birthYear: 1990 },
    { name: 'Kim Ang', birthYear: 1995 },
    { name: 'Hok Tin', birthYear: 2015 },
  ], { returning: true });

  // Add books for each author
  await authors[0].createBook({ title: 'Ronan Book 1', publicationYear: 2010, pages: 200 });
  await authors[0].createBook({ title: 'Ronan Book 2', publicationYear: 2012, pages: 150 });

  await authors[1].createBook({ title: 'Kim Ang Book 1', publicationYear: 2020, pages: 300 });
  await authors[1].createBook({ title: 'Kim Ang Book 2', publicationYear: 2021, pages: 250 });

  await authors[2].createBook({ title: 'Hok Tin Book 1', publicationYear: 2022, pages: 100 });
  await authors[2].createBook({ title: 'Hok Tin Book 2', publicationYear: 2023, pages: 120 });

  // Q3.1: Fetch all books by a given author (ex: Kim Ang)
  const kim = await Author.findOne({ where: { name: 'Kim Ang' } });
  const kimsBooks = await kim.getBooks();
  console.log('Books by Kim Ang:', kimsBooks.map(b => b.title));

  // Q3.2: Create a new book for an existing author using .createBook()
  const newBook = await kim.createBook({ title: 'Kim Ang Book 3', publicationYear: 2024, pages: 180 });
  console.log('Created new book for Kim Ang:', newBook.title);

  // Q3.3: List all authors along with their books (include)
  const authorsWithBooks = await Author.findAll({ include: { model: Book, as: 'books' } });
  for (const author of authorsWithBooks) {
    console.log(`Author: ${author.name} (born ${author.birthYear})`);
    for (const book of author.books) {
      console.log(`  - ${book.title} (${book.publicationYear}, ${book.pages} pages)`);
    }
  }

  await sequelize.close();
}

main().catch(console.error); 