exports.up = function(knex, Promise) {
  return knex.schema.createTable('friends', function(tbl) {
    tbl.increments()

    tbl
      .string('name', 128)
      .notNullable()

    tbl
      .string('email', 128)
      .notNullable()

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('friends')
};