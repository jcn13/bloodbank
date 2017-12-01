const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  let bloodbanks
  knex('bloodbank')
  .join('employee', 'bloodbank.emp_id', '=', 'employee.id')
  .join('order', 'order.bno', '=', 'bloodbank.id')
  .count('order.bno as orders')
  .groupBy('order.bno')
  .select('bloodbank.*', 'employee.name as emp_name')
  .then(data =>{
    bloodbanks = data
    // return knex('order')
    //         .count('bno as bno')
    //         .join('bloodbank', 'bloodbank.id', '=', 'order.bno')
    //         .groupBy('bno')
    //         .select('bloodbank.id')
    //         .then(order =>{
              console.log(bloodbanks)
              res.render(`bloodbank/all`, {
                bloodbanks: bloodbanks
                // order: order
              // })
            })  	
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('bloodbank')
  .join('employee', 'bloodbank.emp_id', '=', 'employee.id')
  .join('order')
  .count('order.bno as orders')
  .groupBy('order.bno')
  .select('bloodbank.*', 'employee.name as emp_name')
	  .first()
	  .then(bloodbank =>{
	  	console.log('bloodbank', bloodbank)
	  	res.render(viewName, bloodbank)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid bloodbank'
	  	})
	}
}

function respondAndRenderEdit(id, res, viewName){
  if(!isNaN(id)){
    knex('bloodbank')
    .join('blood', 'bloodbank.bid', '=', 'blood.id')
    .join('bloodbank', 'bloodbank.bno', '=', 'bloodbank.id')
    .join('hospital', 'bloodbank.hid', '=', 'hospital.id')
    .select('bloodbank.*', 'bloodbank.id', 'blood.type', 'hospital.name')
    .where('bloodbank.id', id)
    .first()
    .then(bloodbank =>{
      let hospital
      knex('hospital')
      .select()
      .then(dataD =>{
        hospital = dataD
        let blood
        return knex('blood')
                .select()
                .then(dataB =>{
                  blood = dataB
                  return knex('bloodbank')
                          .select()
                          .then(bloodbank =>{
                            console.log(hospital, blood, bloodbank, bloodbank)
                            res.render(viewName, {
                            bloodbank: bloodbank,
                            hospital: hospital,
                            blood: blood,
                            bloodbank: bloodbank})
                          })
                  })
        })
  })
  }else{
      res.status(500)
      res.render('error', {
        message: 'Invalid bloodbank'
      })
  }
}

function validateInsertUpdateRedirect(req, res, callback){
  console.log(req.body)
	if(validbloodbank(req.body)){
  	let bloodbank = {
  		bid: req.body.bid,
      hid: req.body.hid,
      bno: req.body.bno,
      date: new Date()
  	}
    console.log(bloodbank)
  	callback(bloodbank)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid bloodbank'
  	})
  }
}

router.get('/new', (req, res) => {
  knex('bloodbank')
  .join('employee', 'bloodbank.emp_id', '=', 'employee.id')
  .select('bloodbank.*', 'employee.name as emp_name')
  .then(bloodbank =>{
    console.log(bloodbank)
    res.render(`bloodbank/new`, {
    bloodbank: bloodbank})
  })
})


router.get('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
    let bloodbank
    knex('bloodbank')
  .join('employee', 'bloodbank.emp_id', '=', 'employee.id')
  .join('order')
  .count('order.bno as orders')
  .groupBy('order.bno')
  .select('bloodbank.*', 'employee.name as emp_name')
    .where('bloodbank.id', id)
    .first()
    .then(data =>{
      bloodbank = data
      let order
      return knex('order')
              .join('blood', 'order.bid', '=', 'blood.id')
              .join('bloodbank', 'order.bno', '=', 'bloodbank.id')
              .join('hospital', 'order.hid', '=', 'hospital.id')
              .select('order.*', 'bloodbank.id', 'blood.type', 'hospital.name')
              .where('order.bno', id)
              .then(dataB =>{
                order = dataB
                return knex('donation')
                        .join('donor', 'donation.did', '=', 'donor.id')
                        .join('blood', 'donor.blood', '=', 'blood.id')
                        .join('employee', 'donation.emp_id', '=', 'employee.id')
                        .count('blood.id as qtd')
                        .groupBy('blood.id')
                        .select('donation.*', 'blood.type')
                        .where('donation.bno', id)
                        .then(blood =>{
                              console.log(bloodbank, order, blood)
                              res.render(`bloodbank/single`, {
                                bloodbank: bloodbank,
                                order: order,
                                blood: blood
                              })
                })
      })    
  })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid bloodbank'
    })
  }
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
  knex('bloodbank')
  .select()
  .where('bloodbank.id', id)
	respondAndRenderEdit(id, res, 'bloodbank/edit')
})

function validbloodbank(bloodbank){
	return !isNaN(Number(bloodbank.bid)) &&
    !isNaN(Number(bloodbank.hid)) &&
    !isNaN(Number(bloodbank.bno))  
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (bloodbank) =>{
  console.log(bloodbank.did)
  	knex('bloodbank')
  		.insert(bloodbank, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/bloodbank/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (bloodbank) =>{
  	knex('bloodbank')
  		.where('id', req.params.id)
  		.update(bloodbank, 'id')
  		.then(() => {
  			res.redirect(`/bloodbank/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('bloodbank')
	  .select()
	  .where('id', id)
	  .del()
	  .then(bloodbank =>{
      console.log(req.params.did)
	  	res.redirect(`/bloodbank/`)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid bloodbank'
	  	})
	}
})

module.exports = router