const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('order')
  .join('blood', 'order.bid', '=', 'blood.id')
  .join('bloodbank', 'order.bno', '=', 'bloodbank.id')
  .join('hospital', 'order.hid', '=', 'hospital.id')
  .select('order.*', 'blood.type','hospital.name')
  .then(orders =>{
    console.log(orders)
  	res.render(`order/all`, {orders: orders})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('order')
    .join('blood', 'order.bid', '=', 'blood.id')
    .join('bloodbank', 'order.bno', '=', 'bloodbank.id')
    .join('hospital', 'order.hid', '=', 'hospital.id')
    .select('order.*', 'blood.type', 'hospital.name')
	  .first()
	  .then(order =>{
	  	console.log('order', order)
	  	res.render(viewName, order)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid order'
	  	})
	}
}

function respondAndRenderEdit(id, res, viewName){
  if(!isNaN(id)){
    knex('order')
    .join('blood', 'order.bid', '=', 'blood.id')
    .join('bloodbank', 'order.bno', '=', 'bloodbank.id')
    .join('hospital', 'order.hid', '=', 'hospital.id')
    .select('order.*', 'blood.type', 'hospital.name')
    .where('order.id', id)
    .first()
    .then(order =>{
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
                            console.log(hospital, blood, bloodbank, order)
                            res.render(viewName, {
                            order: order,
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
        message: 'Invalid order'
      })
  }
}

function validateInsertUpdateRedirect(req, res, callback){
  console.log(req.body)
	if(validorder(req.body)){
  	let order = {
  		bid: req.body.bid,
      hid: req.body.hid,
      bno: req.body.bno,
      date: new Date()
  	}
    console.log(order)
  	callback(order)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid order'
  	})
  }
}

router.get('/new', (req, res) => {
  let blood
  knex('blood')
  .select()
  .then(dataB =>{
    blood = dataB
    return knex('bloodbank')
            .select()
            .then(dataB =>{
              bloodbank = dataB
              return knex('hospital')
                      .select()
                      .then(hospital =>{
                        console.log(hospital, blood, bloodbank)
                        res.render(`order/new`, {
                        hospital: hospital,
                        blood: blood,
                        bloodbank: bloodbank})
                      })
              })
    })
})


router.get('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){

    knex('order')
    .join('blood', 'order.bid', '=', 'blood.id')
    .join('bloodbank', 'order.bno', '=', 'bloodbank.id')
    .join('hospital', 'order.hid', '=', 'hospital.id')
    .select('order.*', 'blood.type', 'hospital.name')
    .where('order.id', id)
    .first()
    .then(order =>{
     res.render('order/single', order)
    })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid order'
    })
  }
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
  knex('order')
  .select()
  .where('order.id', id)
	respondAndRenderEdit(id, res, 'order/edit')
})

function validorder(order){
	return !isNaN(Number(order.bid)) &&
    !isNaN(Number(order.hid)) &&
    !isNaN(Number(order.bno))  
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (order) =>{
  console.log(order.did)
  	knex('order')
  		.insert(order, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/order/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (order) =>{
  	knex('order')
  		.where('id', req.params.id)
  		.update(order, 'id')
  		.then(() => {
  			res.redirect(`/order/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('order')
	  .select()
	  .where('id', id)
	  .del()
	  .then(order =>{
      console.log(req.params.did)
	  	res.redirect(`/order/`)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid order'
	  	})
	}
})

module.exports = router