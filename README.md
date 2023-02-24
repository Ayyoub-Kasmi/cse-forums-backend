# cse-forums-backend
** Backend source code for CSE Forums platform project **

For the .env file, the current used variables are:

PORT

JWT_SECRET

DATABASE_URL = "mysql://username:password@localhost:db_port/db_name?schema=public"


For the prisma package, the schema is already there in the main branch, so use "npx prisma push" to push the schema into MySQL server.


For the response format, use this:

res.json({
  success: true/false,
  message: '',
  data: {},
})
