module.exports = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsRun: false,
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations'
  },
  logging: true
};
