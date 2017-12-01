const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('hospital')
  .select()
  .then(hospitals =>{
  	res.render('hospital/all', {hospitals: hospitals})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('hospital')
	  .select()
	  .where('hospital.id', id)
	  .first()
	  .then(hospital =>{
	  	console.log('hospital', hospital)
	  	res.render(viewName, hospital)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid hospital'
	  	})
	}
}

function validateInsertUpdateRedirect(req, res, callback){
	if(validhospital(req.body)){
  	let hospital = {
  		name: req.body.name,
      address: req.body.address,
      phone_number: req.body.phone_number,
  	}
    console.log(hospital)
  	callback(hospital)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid hospital'
  	})
  }
}

router.get('/new', (req, res) => {
  res.render('hospital/new')
})

router.get('/:id', (req, res) => {
	const id = req.params.id
	respondAndRender(id, res, 'hospital/single')
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
	respondAndRender(id, res, 'hospital/edit')
})

function validhospital(hospital){
	return typeof hospital.name == 'string' &&
		hospital.name.trim() != '' && 
    typeof hospital.address == 'string' &&
    hospital.address.trim() != '' && 
    typeof hospital.phone_number == 'string' &&
    hospital.phone_number.trim() != '' 
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (hospital) =>{
  	knex('hospital')
  		.insert(hospital, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/hospital/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (hospital) =>{
  	knex('hospital')
  		.where('id', req.params.id)
  		.update(hospital, 'id')
  		.then(() => {
  			res.redirect(`/hospital/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('hospital')
	  .select()
	  .where('id', id)
	  .del()
	  .then(hospital =>{
	  	res.redirect('/hospital')
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid hospital'
	  	})
	}
})

module.exports = router