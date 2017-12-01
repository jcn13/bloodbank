const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('donation')
  .join('donor', 'donation.did', '=', 'donor.id')
  .join('blood', 'donor.blood', '=', 'blood.id')
  .join('employee', 'donation.emp_id', '=', 'employee.id')
  .select('donation.*', 'donor.name', 'blood.type', 'employee.name as emp_name')

  .then(donations =>{
    console.log(donations)
  	res.render(`donation/all`, {donations: donations})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('donation')
    .join('donor', 'donation.did', '=', 'donor.id')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .join('employee', 'donation.emp_id', '=', 'employee.id')
    .select('donation.*', 'donor.name', 'blood.type', 'employee.name as emp_name')
	  .first()
	  .then(donation =>{
	  	console.log('donation', donation)
	  	res.render(viewName, donation)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid donation'
	  	})
	}
}

function respondAndRenderEdit(id, res, viewName){
  if(!isNaN(id)){
    knex('donation')
    .join('donor', 'donation.did', '=', 'donor.id')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .join('employee', 'donation.emp_id', '=', 'employee.id')
    .select('donation.*', 'donor.name', 'blood.type', 'employee.name as emp_name')
    .where('donation.id', id)
    .first()
    .then(donation =>{
      let donor
      knex('donor')
      .select()
      .then(dataD =>{
        donor = dataD
        let blood
        return knex('blood')
                .select()
                .then(dataB =>{
                  blood = dataB
                  let bloodbank
                  return knex('bloodbank')
                          .select()
                          .then(dataE =>{
                            bloodbank = dataE
                            return knex('employee')
                                    .select()
                                    .then(employee =>{
                                      console.log(donor, employee, blood, bloodbank, donation)
                                      res.render(viewName, {
                                      donation: donation,
                                      donor: donor,
                                      employee: employee,
                                      blood: blood,
                                      bloodbank: bloodbank})
                                    })
                          })
                })
      })
    })
  }else{
      res.status(500)
      res.render('error', {
        message: 'Invalid donation'
      })
  }
}

function validateInsertUpdateRedirect(req, res, callback){
  console.log(req.body)
	if(validdonation(req.body)){
  	let donation = {
  		did: req.body.did,
      emp_id: req.body.emp_id,
      bno: req.body.bno,
      date: new Date()
  	}
    console.log(donation)
  	callback(donation)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid donation'
  	})
  }
}

router.get('/new', (req, res) => {
  let donor
  knex('donor')
  .select()
  .then(dataD =>{
    donor = dataD
    let blood
    return knex('blood')
            .select()
            .then(dataB =>{
              blood = dataB
              let bloodbank
              return knex('bloodbank')
                      .select()
                      .then(dataE =>{
                        bloodbank = dataE
                        return knex('employee')
                                .select()
                                .then(employee =>{
                                  console.log(donor, employee, blood, bloodbank)
                                  res.render(`donation/new`, {
                                  donor: donor,
                                  employee: employee,
                                  blood: blood,
                                  bloodbank: bloodbank})
                                })
                      })
            })
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){

    knex('donation')
    .join('donor', 'donation.did', '=', 'donor.id')
    .join('blood', 'donor.blood', '=', 'blood.id')
    .join('employee', 'donation.emp_id', '=', 'employee.id')
    .select('donation.*', 'donor.name', 'blood.type', 'employee.name as emp_name')
    .where('donation.id', id)
    .first()
    .then(donation =>{
     res.render('donation/single', donation)
    })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid donation'
    })
  }
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
  knex('donation')
  .select()
  .where('donation.id', id)
	respondAndRenderEdit(id, res, 'donation/edit')
})

function validdonation(donation){
	return !isNaN(Number(donation.did)) &&
    !isNaN(Number(donation.emp_id)) &&
    !isNaN(Number(donation.bno))  
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (donation) =>{
  console.log(donation.did)
  	knex('donation')
  		.insert(donation, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/donation/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (donation) =>{
  	knex('donation')
  		.where('id', req.params.id)
  		.update(donation, 'id')
  		.then(() => {
  			res.redirect(`/donation/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('donation')
	  .select()
	  .where('id', id)
	  .del()
	  .then(donation =>{
      console.log(req.params.did)
	  	res.redirect(`/donation/`)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid donation'
	  	})
	}
})

module.exports = router