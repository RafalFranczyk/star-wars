/* eslint-disable prettier/prettier */
export const config = () => ({
  port: process.env.PORT,
  db_connection: process.env.DB_CONNECTION,
  db_test_connection: process.env.DB_TEST_CONNECTION,
});
