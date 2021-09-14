# RESTful API Node Express Mongoose Example

The project builds RESTful APIs using Node.js, Express and Mongoose, ...

## Manual Installation

Clone the repo:

```bash
git clone https://github.com/de4th-zone/backend-node-express.git
cd backend-node-express
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env
# open .env and modify the environment variables
```

## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Commands

Running in local:

```bash
npm start
# or
npm run dev
```

Running in production:

```bash
# build
npm run build
# start
npm run prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
# App name
APP_NAME =

# JWT
JWT_ACCESS_TOKEN_SECRET = access
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES = 240
JWT_REFRESH_TOKEN_SECRET = refresh
JWT_REFRESH_TOKEN_EXPIRATION_DAYS = 1
JWT_VERIFY_EMAIL_SECRET = verifyEmail
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = 60
JWT_RESET_PASSWORD_SECRET = resetPassword
JWT_RESET_PASSWORD_EXPIRATION_MINUTES = 30

# URL of the Mongo DB
DATABASE_URI =

# SMTP configuration
SMTP_HOST = smtp.googlemail.com
SMTP_PORT = 465
SMTP_USERNAME =
SMTP_PASSWORD =
EMAIL_FROM =

# URL frontend
FRONTEND_URL =

# URL images
IMAGE_URL =
```

## Project Structure

```
public\             # Public folder
src\
 |--config\         # Environment variables and configuration
 |--controllers\    # Controllers
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models
 |--routes\         # Routes
 |--services\       # Business logic
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--index.js        # App entry point
```

### API Endpoints

List of available routes:

**Auth routes**:\
`POST api/v1/auth/signup` - Signup\
`POST api/v1/auth/signin` - Signin\
`POST api/v1/auth/logout` - Logout\
`POST api/v1/auth/refresh-tokens` - Refresh auth tokens\
`POST api/v1/auth/forgot-password` - Send reset password email\
`POST api/v1/auth/reset-password` - Reset password\
`POST api/v1/auth/send-verification-email` - Send verification email\
`POST api/v1/auth/verify-email` - Verify email\
`POST api/v1/auth/me` - Profile\
`PUT api/v1/auth/me` - Update profile

**User routes**:\
`POST api/v1/users` - Create a user\
`GET api/v1/users` - Get all users\
`GET api/v1/users/:userId` - Get user\
`PUT api/v1/users/:userId` - Update user\
`DELETE api/v1/users/:userId` - Delete user

**Role routes**:\
`POST api/v1/roles` - Create a role\
`GET api/v1/roles` - Get all roles\
`GET api/v1/roles/:userId` - Get role\
`PUT api/v1/roles/:userId` - Update role\
`DELETE api/v1/roles/:userId` - Delete role

**Image routes**:\
`POST api/v1/images/upload` - Upload image

## License

[MIT](LICENSE)
