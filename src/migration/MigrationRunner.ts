import path from "path";
import { PoolConfig } from "pg";
import AppRoot from "app-root-path";
import { readdirSync } from "fs";
import MigrationInterface from "./MigrationInterface";

interface Config extends PoolConfig {
  migrationsFolder: string;
}

function getMigrationsFolder({ migrationsFolder }: Config): string {
  const migrationPath =
    migrationsFolder.charAt(0) !== "/"
      ? `${AppRoot.path}/${migrationsFolder.replace(/^\.\//g, "")}`
      : migrationsFolder;

  return migrationPath;
}

function getMigrations(config: Config): MigrationInterface[] {
  const migrationsFolder = getMigrationsFolder(config);
  const migrationsFiles = readdirSync(migrationsFolder);

  return migrationsFiles
    .filter((file) => file.endsWith(".ts"))
    .map((file) => {
      const migrationPath = path.join(migrationsFolder, file);
      // const sourceCode = readFileSync(migrationPath).toString();

      // transpile the ts to js
      // const { code } = transformSync(sourceCode, {
      //   loader: "ts",
      //   format: "cjs",
      //   target: "esnext",
      // });
      // const migrationModule = eval(code);
      const migrationModule = require(migrationPath);

      return migrationModule.default;
    });
}

export default function MigrationRunner(config: Config) {
  const migrations = getMigrations(config);

  console.log(migrations);
}
