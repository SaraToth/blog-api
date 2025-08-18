# blog-api
A blog API backend created with Node.js and Express


This project was created in accordance with the
[Odin Project Blog API lesson](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api)

You can also find the frontend consumption blog designed for this API at [Blog Basic](https://github.com/SaraToth/blog-basic)

## Getting Started

First, fork a clone of this repository and set up your local environment.

Run the following to install all dependencies:
```
npm install
```

### Schema and Authentication Setup

You will need to create your own psql database, and then update the .env-template with your database URL information, you can also add your own secret as the JWT_SECRET

Then you can run the following to setup the tables in your database:
```
npx prisma migrate dev
```

### CORS Policy for frontend interaction

Once you get the blog api set and running, if you intend to setup a frontend as well you will need to refer to this CORS policy on the app.js module:

```js
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
```

Make sure the origin is pointing to the correct front-end server or adjust this for your project. You can refer to the CORS documentation for more information.

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

- **Enum: postStatus**
    - PUBLISHED: Posts that are published and visible to every authorized user.
    - DRAFT: Posts that have not been published but saved in the db by the ADMIN (author) and only visible to them.

- **User**
    - id, firstName lastName, email, password, type
    - Relationships: posts, comments; Only an admin will have posts while all users can post comments

- **Post**
    - id, title, content, createdAt
    - postStatus: Whether a post is published or a draft.
    - slug: a slugged version of the title used as parameter to route to posts
    - Relationships: author = the admin user, comments = comments left by other members

- **Comment**
    - id, content, createdAt
    - Relationships: user = user who posted the comment, post = the blog post the comment is responding to


## JSON Web Tokens and Authentication

In this project, I set up JSON web tokens using the
[passport-jwt strategy](https://www.passportjs.org/packages/passport-jwt/)

First, json web token was configurated, and we select for data that we might need (excluding sensitive data such as password)

```js
const options = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new jwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    type: true,
                }
            });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);
```


When users login succesfully a jwt is signed with the user's information.

```js
    const token = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({token});
```

Then the token can be verified with the verifyToken middleware function.
```js
const passport = require("../config/passport");

const verifyToken = passport.authenticate("jwt", { session: false});
```

Then this middleware is attached as the first middleware in the chain, for all protected routes.

## Middlewares

- **isAdmin** - verifies that the user has ADMIN user_type before allowing them to do protected actions like write, edit or delete blog posts. Currently, this project is designed to work with only 1 ADMIN user.

- **isAuthor** - verifies that the comment author, matches the user data stored in the JSON web token before allowing a user to edit their comments. (Ensures the user is the author of that comment).

- **verifyToken** - verifiies the JSON webtoken, and checks for authorization on protected routes.

- **getAminId** - gets the admin id to get posts for consumption by all users
