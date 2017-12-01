const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('blood')
  .select()
  .then(bloods =>{
  	res.render('blood/all', {bloods: bloods})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('blood')
	  .select()
	  .where('blood.id', id)
	  .first()
	  .then(blood =>{
	  	console.log('blood', blood)
	  	res.render(viewName, blood)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid blood'
	  	})
	}
}

function validateInsertUpdateRedirect(req, res, callback){
	if(validblood(req.body)){
  	let blood = {
  		cost: req.body.cost,
      type: req.body.type
  	}
    console.log(blood)
  	callback(blood)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid blood'
  	})
  }
}

router.get('/new', (req, res) => {
  res.render('blood/new')
})

router.get('/:id', (req, res) => {
	const id = req.params.id
	respondAndRender(id, res, 'blood/single')
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
	respondAndRender(id, res, 'blood/edit')
})

function validblood(blood){
	return !isNaN(Number(blood.cost)) &&
    typeof blood.type == 'string' &&
		blood.type.trim() != '' 
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (blood) =>{
  	knex('blood')
  		.insert(blood, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/blood/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (blood) =>{
  	knex('blood')
  		.where('id', req.params.id)
  		.update(blood, 'id')
  		.then(() => {
  			res.redirect(`/blood/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('blood')
	  .select()
	  .where('id', id)
	  .del()
	  .then(blood =>{
	  	res.redirect('/blood')
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid blood'
	  	})
	}
})

module.exports = router