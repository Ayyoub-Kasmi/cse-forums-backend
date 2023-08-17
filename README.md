# cse-forums-backend
** Backend source code for CSE Forums platform project **


For the prisma package, the schema is already there in the main branch, so use "npx prisma push" to push the schema into the database server.


For the response format, use this:

res.json({
  success: true/false,
  message: '',
  data: {},
})
