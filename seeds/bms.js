
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('donor').del()
    .then(function () {
      const donors = [{
        name: 'Joao',
        address: 'RRR',
        age: 37,
        sex: 'male',
        phone_number: '604-333-3333',
        blood: 1
      }, {
        name: 'Thalita',
        address: 'RRR',
        age: 35,
        sex: 'female',
        phone_number: '604-333-3334',
        blood: 2
      }, {
        name: 'Livia',
        address: 'YYY',
        age: 30,
        sex: 'female',
        phone_number: '604-333-3335',
        blood: 3
      }, {
        name: 'Daniel',
        address: 'YYY',
        age: 37,
        sex: 'male',
        phone_number: '604-333-3337',
        blood: 4
      }]
      return knex('donor').insert(donors)      
    }),
    knex('employee').del()
    .then(function () {
      const employees = [{
        name: 'Eduardo',
        address: 'SSS',
        role: 2,
        email: 'eduardo@bb.ca',
        phone_number: '604-333-3333'
      }, {
        name: 'Priscila',
        address: 'VVV',
        role: 1,
        email: 'priscila@bb.ca',
        phone_number: '604-333-3334'
      }]
      return knex('employee').insert(employees)      
    }),
    knex('role').del()
    .then(function () {
      const roles = [{
        position: 'Receptionist'        
      }, {
        position: 'Manager'        
      }]
      return knex('role').insert(roles)      
    }),
    knex('blood').del()
    .then(function () {
      const bloods = [{
        cost: 100,
        type: 'O-'        
      }, {
        cost: 50,
        type: 'O+'
      }, {
        cost: 50,
        type: 'A-'
      }, {
        cost: 50,
        type: 'A+'
      }, {
        cost: 50,
        type: 'B-'
      }, {
        cost: 50,
        type: 'B+' 
      }, {
        cost: 50,
        type: 'AB-'
      }, {
        cost: 50,
        type: 'AB+'       
      }]
      return knex('blood').insert(bloods)      
    }),
    knex('hospital').del()
    .then(function () {
      const hospitals = [{
        name: 'Burnaby General Hospital',
        address: 'BBB',
        phone_number: '604-333-3333'
      }, {
        name: 'Vancouver General Hospital',
        address: 'VVV',
        phone_number: '604-333-3334'
      }]
      return knex('hospital').insert(hospitals)      
    }),
    knex('bloodbank').del()
    .then(function () {
      const bloodbanks = [{
        emp_id: 1        
      }]
      return knex('bloodbank').insert(bloodbanks)      
    })
  ])
}
