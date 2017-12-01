
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('donor', (table) =>{
  		table.increments()
  		table.text('name').notNullable()
  		table.text('address').notNullable()
  		table.date('birth').notNullable()
  		table.text('sex')
  		table.text('phone_number').notNullable()
      table.integer('blood').notNullable()
  	}),
  	knex.schema.createTable('employee', (table) =>{
  		table.increments()
  		table.text('name').notNullable()
  		table.text('address').notNullable()
  		table.integer('role').notNullable()
  		table.text('email').notNullable()
  		table.text('phone_number').notNullable()
  	}),
  	knex.schema.createTable('role', (table) =>{
  		table.increments()
  		table.text('position').notNullable()  		
  	}),
  	knex.schema.createTable('bloodbank', (table) =>{
  		table.increments()
  		table.integer('emp_id').notNullable() 		
  	}), 
  	knex.schema.createTable('order', (table) =>{
  		table.increments()
  		table.integer('bid').notNullable()
  		table.integer('bno').notNullable() 
  		table.integer('hid').notNullable()	
      table.datetime('date').notNullable()	
  	}), 
  	knex.schema.createTable('issue', (table) =>{
  		table.increments()
  		table.integer('bid').notNullable()
  		table.integer('bno').notNullable()	
      table.date('date').notNullable()	
  	}),
  	knex.schema.createTable('hospital', (table) =>{
  		table.increments()
  		table.text('name').notNullable()
  		table.text('address').notNullable()
  		table.text('phone_number').notNullable()
  	}),
  	knex.schema.createTable('blood', (table) =>{
  		table.increments()
  		table.integer('cost').notNullable()
  		table.text('type').notNullable()  		
  	}), 
    knex.schema.createTable('donation', (table) =>{
      table.increments()
      table.integer('did').notNullable()  
      table.integer('bno').notNullable()
      table.integer('emp_id').notNullable()
      table.datetime('date').notNullable()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('donor'),
  	knex.schema.dropTable('employee'),
  	knex.schema.dropTable('role'),
  	knex.schema.dropTable('bloodbank'),
  	knex.schema.dropTable('order'),
  	knex.schema.dropTable('issue'),
  	knex.schema.dropTable('hospital'),
    knex.schema.dropTable('donation'),
  	knex.schema.dropTable('blood')
  ])
}
