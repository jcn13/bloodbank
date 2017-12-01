const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('employee')
  .join('role', 'employee.role', '=', 'role.id')
  .select('employee.id', 'employee.name', 'employee.address','employee.role', 'role.position', 'employee.email', 'employee.phone_number')
  .then(employees =>{
  	res.render('employee/all', {employees: employees})
  })
})


router.get('/query/', (req, res) => {
  const name = '%' + req.query.name + '%'
  console.log(name)
  knex('employee')
  .select()
  .where('name', 'like', name)
  .then(employees =>{
  	res.render('employee/all', {employees: employees})
  })
})

function respondAndRender(id, res, viewName){
  let employees
	if(!isNaN(id)){
	  knex('employee')
	  .join('role', 'employee.role', '=', 'role.id')
    .select('employee.id', 'employee.name', 'employee.address', 'employee.role', 'role.position', 'employee.email', 'employee.phone_number')
	  .where('employee.id', id)
	  .first()
	  .then(employee =>{
      employee = employee
      return knex('role')
              .select()
              .then(role =>{
                res.render(viewName,{
                  role: role,
                  employee: employee
                })
                console.log(role)
                console.log(employee)
              })
	  			})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid employee'
	  	})
	}
}

function validateInsertUpdateRedirect(req, res, callback){
  console.log(req.body)
	if(validemployee(req.body)){
  	let employee = {
  		name: req.body.name,
  		address: req.body.address,
      role: req.body.role,
  		email: req.body.email,
  		phone_number: req.body.phone_number 
  	}
    console.log(employee)
  	callback(employee)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid employee'
  	})
  }
}

router.get('/new', (req, res) => {
  knex('role')
    .select()
    .then(role =>{
      console.log(role)
      res.render('employee/new', {role: role})
    })
})

// router.get('/searchEmp', (req, res) => {
//   res.render('search')
// })

router.get('/:id', (req, res) => {
	const id = req.params.id
	if(!isNaN(id)){
    knex('employee')
    .join('role', 'employee.role', '=', 'role.id')
    .select('employee.id', 'employee.name', 'employee.address', 'employee.role', 'role.position', 'employee.email', 'employee.phone_number')
    .where('employee.id', id)
    .first()
    .then(employee =>{
     res.render('employee/single', employee)
    })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid employee'
    })
  }
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
	respondAndRender(id, res, 'employee/edit')
})

function validemployee(employee){
	return typeof employee.name == 'string' &&
		employee.name.trim() != '' &&
		typeof employee.address == 'string' &&
		employee.address.trim() != '' &&
		!isNaN(Number(employee.role)) &&
		typeof employee.email == 'string' &&
		employee.email.trim() != '' &&
		typeof employee.phone_number == 'string' &&
		employee.phone_number.trim() != '' 
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (employee) =>{
  	knex('employee')
  		.insert(employee, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/employee/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  console.log(req.params.id)
  validateInsertUpdateRedirect(req, res, (employee) =>{
  	knex('employee')
  		.where('id', req.params.id)
  		.update(employee, 'id')
  		.then(() => {
  			res.redirect(`/employee/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('employee')
	  .select()
	  .where('id', id)
	  .del()
	  .then(employee =>{
	  	res.redirect('/employee')
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid employee'
	  	})
	}
})

module.exports = router