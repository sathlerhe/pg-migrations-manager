import MigrationInterface from "../src/migration/MigrationInterface";

const migration: MigrationInterface = {
  up: `
    CREATE TABLE users
  `,
  down: `
    DROP TABLE users
  `,
}

export default migration
