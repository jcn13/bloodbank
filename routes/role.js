const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('role')
  .select()
  .then(roles =>{
  	res.render('role/all', {roles: roles})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('role')
	  .select()
	  .where('role.id', id)
	  .first()
	  .then(role =>{
	  	console.log('role', role)
	  	res.render(viewName, role)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid role'
	  	})
	}
}

function validateInsertUpdateRedirect(req, res, callback){
	if(validrole(req.body)){
  	let role = {
  		position: req.body.position
  	}
    console.log(role)
  	callback(role)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid role'
  	})
  }
}

router.get('/new', (req, res) => {
  res.render('role/new')
})

router.get('/:id', (req, res) => {
	const id = req.params.id
	respondAndRender(id, res, 'role/single')
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
	respondAndRender(id, res, 'role/edit')
})

function validrole(role){
	return typeof role.position == 'string' &&
		role.position.trim() != '' 
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (role) =>{
  	knex('role')
  		.insert(role, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/role/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (role) =>{
  	knex('role')
  		.where('id', req.params.id)
  		.update(role, 'id')
  		.then(() => {
  			res.redirect(`/role/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('role')
	  .select()
	  .where('id', id)
	  .del()
	  .then(role =>{
	  	res.redirect('/role')
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid role'
	  	})
	}
})

module.exports = router