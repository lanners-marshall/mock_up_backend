exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl) {
    tbl.increments()

    tbl
      .string('name', 128)
      .notNullable()

    tbl
      .string('email', 128)
      .notNullable()
      .unique()

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};