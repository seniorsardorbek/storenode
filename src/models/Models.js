class User {
  constructor(id, firstName, lastName, email, password, role) {
    this.id = id,
      this.firstName = firstName,
      this.lastName = lastName,
      this.email = email,
      this.password = password,
      this.role = role;
  }
}

class Book {
  constructor(id, title, authorId, category) {
    this.id = id,
      this.title = title,
      this.authorId = authorId,
      this.category = category;
  }
}

class AuthorModel {
  constructor (id, name) {
    this.id = id ,this.name = name;
  }
}

module.exports = { User, Book , AuthorModel };
