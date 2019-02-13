exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(tbl) {
    tbl.increments()

    tbl
      .string('name', 128)
      .notNullable()

    tbl
      .string('location', 128)
      .notNullable()

    tbl
      .string('date')
      .notNullable()

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events')
};