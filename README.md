# blog-api
A blog API backend created with Node.js and Express


## Getting Started

First, fork a clone of this repository and set up your local environment.

Run the following to install all dependencies:
```
npm install
```

## Schema Setup

You will need to create your own psql database, and then update the .env-template with your database URL information

Then you can run the following to setup the tables in your database:
```
npx prisma migrate dev
```

## Database Schema

### Naming differences in Prisma and PSQL

Since both prisma, and psql have their own naming standards. All fields, where necessary, are mapped to the proper psql naming convention.

Models in schema are capitalized and singular case, whereas tables in psql are lowercase and plural.
**Prisma**: User -> **PSQL** users

Multiple wordsd are handled differently as well. Prisma schema uses camel case while psql uses an underscore
**Prisma** firstName -> **PSQL** first_name

### Database Structure

While the current project is designed to only allow one admin user, and multiple members. The current schema structure makes it very easy to create multiple admin, and thus multiple blog publishers if your site has multiple authors, or you wish to expand to a blog community.

- **Enum: UserType**
    - ADMIN: Blog owner. Will be able to write/delete blog posts, as well as delete comments made by other users.
    - MEMBER: Can view blog posts and their corresponding comments as well as leave comments. Can only edit or delete their own comments.

- **User**
    - id, firstName lastName, email, password, type
    - Relationships: posts, comments; Only an admin will have posts while all users can post comments

- **Post**
    - id, title, content, createdAt
    - Relationships: author = the admin user, comments = comments left by other members

- **Comment**
    - id, content, createdAt
    - Relationships: user = user who posted the comment, post = the blog post the comment is responding to