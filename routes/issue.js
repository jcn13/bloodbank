const express = require('express')
const router = express.Router()

const knex = require('../db/knex')

router.get('/', (req, res) => {
  knex('issue')
  .join('blood', 'issue.bid', '=', 'blood.id')
  .join('bloodbank', 'issue.bno', '=', 'bloodbank.id')
  .select('issue.*', 'blood.type')
  .then(issues =>{
  	res.render(`issue/all`, {issues: issues})
  })
})

function respondAndRender(id, res, viewName){
	if(!isNaN(id)){
	  knex('issue')
    .join('blood', 'issue.bid', '=', 'blood.id')
    .join('bloodbank', 'issue.bno', '=', 'bloodbank.id')
    .select('issue.*','blood.type')
	  .first()
	  .then(issue =>{
	  	console.log('issue', issue)
	  	res.render(viewName, issue)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid issue'
	  	})
	}
}

function respondAndRenderEdit(id, res, viewName){
  if(!isNaN(id)){
    knex('issue')
    .join('blood', 'issue.bid', '=', 'blood.id')
    .join('bloodbank', 'issue.bno', '=', 'bloodbank.id')
    .select('issue.*',  'blood.type')
    .where('issue.id', id)
    .first()
    .then(issue =>{
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
                            console.log(hospital, blood, bloodbank, issue)
                            res.render(viewName, {
                            issue: issue,
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
        message: 'Invalid issue'
      })
  }
}

function validateInsertUpdateRedirect(req, res, callback){
  console.log(req.body)
	if(validissue(req.body)){
  	let issue = {
  		bid: req.body.bid,
      bno: req.body.bno,
      date: new Date()
  	}
    console.log(issue)
  	callback(issue)
  } else{
  	res.status(500)
  	res.render('error', {
  		message: 'Invalid issue'
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
                        res.render(`issue/new`, {
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

    knex('issue')
    .join('blood', 'issue.bid', '=', 'blood.id')
    .join('bloodbank', 'issue.bno', '=', 'bloodbank.id')
    .select('issue.*', 'blood.type')
    .where('issue.id', id)
    .first()
    .then(issue =>{
     res.render('issue/single', issue)
    })
  }else{
    res.status(500)
    res.render('error', {
      message: 'Invalid issue'
    })
  }
})

router.get('/:id/edit', (req,res) =>{
	const id = req.params.id
  knex('issue')
  .select()
  .where('issue.id', id)
	respondAndRenderEdit(id, res, 'issue/edit')
})

function validissue(issue){
	return !isNaN(Number(issue.bid)) &&
    !isNaN(Number(issue.bno))  
}

router.post('/', (req, res) => {
  validateInsertUpdateRedirect(req, res, (issue) =>{
  console.log(issue.did)
  	knex('issue')
  		.insert(issue, 'id')
  		.then(ids => {
  			const id = ids[0]
  			res.redirect(`/issue/${id}`)
  		})
  })
})

router.put('/:id', (req, res) => {
  validateInsertUpdateRedirect(req, res, (issue) =>{
  	knex('issue')
  		.where('id', req.params.id)
  		.update(issue, 'id')
  		.then(() => {
  			res.redirect(`/issue/${req.params.id}`)
  		})
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(!isNaN(id)){
	  knex('issue')
	  .select()
	  .where('id', id)
	  .del()
	  .then(issue =>{
      console.log(req.params.did)
	  	res.redirect(`/issue/`)
		})
	}else{
	  	res.status(500)
	  	res.render('error', {
	  		message: 'Invalid issue'
	  	})
	}
})

module.exports = router