const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('donor')
  .join('blood', 'donor.blood', '=', 'blood.id')
  .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
  .then(donors =>{
  	res.render('all', {donors: donors})
  })
})


router.get('/query/', (req, res) => {
  let search = req.query.var 
  let name = null
  if( search == 'name'){
    name = '%' + req.query.name + '%'
    console.log(name)
    knex('donor')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
    .where('name', 'like', name)
    .then(donors =>{
    	res.render('all', {donors: donors})
    })
  } else if(search == 'type'){
    name = '%' + req.query.name + '%'
    console.log(search)
    console.log(name)
    knex('donor')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
    .where('blood.type', 'like', name)
    .then(donors =>{
      console.log(donors)
      res.render('all', {donors: donors})
    })
  } else{
    let year
    let sign
    name = req.query.name
    if(search =='age+'){
      sign = '<='
    } else{
      sign = '>='
    }
      year = (new Date()).getFullYear() - name
      knex('donor')
      .join('blood', 'donor.blood', '=', 'blood.id')
      .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
      .where(knex.raw('(year(birth))'), sign, year)
      .then(donors =>{
        res.render('all', {donors: donors})
      })
  }  
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('donor')
	  .join('blood', 'donor.blood', '=', 'blood.id')
    .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
	  .where('donor.id', id)
    .first()
    .then(donor =>{
      donor = donor
      return knex('blood')
              .select()
              .then(blood =>{
                res.render(viewName,{
                  blood: blood,
                  donor: donor
                })
                console.log(blood)
                console.log(donor)
              })
          })
	}else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid Donor'
  	})
	}
}

function validateInsertUpdateRedirect(req, res, callback){
	if(validDonor(req.body)){
  	let donor = {
  		name: req.body.name,
  		address: req.body.address,
  		birth: req.body.birth,
  		sex: req.body.sex,
  		phone_number: req.body.phone_number,
      blood: req.body.blood
  	}
  	callback(donor)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid Donor'
  	})
  }
}

router.get('/new', (req, res) => {
  knex('blood')
    .select()
    .then(blood =>{
      console.log(blood)
      res.render('new', {blood: blood})
    })
})

router.get('/search', (req, res) => {
  res.render('search')
})

router.get('/:id', (req, res) => {
	const id = req.params.id
  let donor
	if(!isNaN(id)){
    knex('donor')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .select('donor.*', knex.raw('(year(curDate()) - year(birth)) as age'), 'blood.type')
    .where('donor.id', id)
    .first()
    .then(data =>{
      donor = data
      return knex('donation')
            .join('donor', 'donation.did', '=', 'donor.id')
            .join('blood', 'donor.blood', '=', 'blood.id')
            .join('employee', 'donation.emp_id', '=', 'employee.id')
            .select('donation.*', 'blood.type', 'employee.name as emp_name')
            .where('donation.did', id)
            .then(donation =>{
              console.log(donor, donation)
              res.render('single', {
                donor: donor, 
                donation: donation
              })          
            })      
      })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid Donor'
    })
  }
})


router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
	respondAndRender(id, res, 'edit')
})

function validDonor(donor){
	return typeof donor.name == 'string' &&
		donor.name.trim() != '' &&
		typeof donor.address == 'string' &&
		donor.address.trim() != '' &&
		typeof donor.sex == 'string' &&
		donor.sex.trim() != '' &&
		typeof donor.phone_number == 'string' &&
		donor.phone_number.trim() != '' &&
    !isNaN(Number(donor.blood))
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (donor) =>{
  	knex('donor')
  		.insert(donor, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/donor/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (donor) =>{
  	knex('donor')
  		.where('id', req.params.id)
  		.update(donor, 'id')
  		.then(() => {
  			res.redirect(`/donor/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('donor')
	  .select()
	  .where('id', id)
	  .del()
	  .then(donor =>{
	  	res.redirect('/donor')
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid Donor'
	  	})
	}
})

module.exports = router