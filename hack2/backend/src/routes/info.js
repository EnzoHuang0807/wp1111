// * ////////////////////////////////////////////////////////////////////////
// *
// * FileName     [ info.js ]
// * PackageName  [ server ]
// * Synopsis     [ Get restaurant info from database ]
// * Author       [ Chin-Yi Cheng ]
// * Copyright    [ 2022 11 ]
// *
// * ////////////////////////////////////////////////////////////////////////

import Info from '../models/info'

exports.GetSearch = async (req, res) => {
    /*******    NOTE: DO NOT MODIFY   *******/
    const priceFilter = req.query.priceFilter
    const mealFilter  = req.query.mealFilter
    const typeFilter  = req.query.typeFilter
    const sortBy      = req.query.sortBy
    /****************************************/

    // NOTE Hint: 
    // use `db.collection.find({condition}).exec(err, data) {...}`
    // When success, 
    //   do `res.status(200).send({ message: 'success', contents: ... })`
    // When fail,
    //   do `res.status(403).send({ message: 'error', contents: ... })` 
    

    // TODO Part I-3-a: find the information to all restaurants

    function comparePrice( a, b ) {
      if ( a.price < b.price ){
        return -1;
      }
      if ( a.price > b.price ){
        return 1;
      }
      return 0;
    }

    function compareDist( a, b ) {
      if ( a.distance < b.distance ){
        return -1;
      }
      if ( a.distance > b.distance ){
        return 1;
      }
      return 0;
    }

    Info.find().exec((err, data) => {
        if (err)
          res.status(403).send({ message: 'error', contents: "error" })

          let index = data.length - 1

          while (index >= 0) {
            if (priceFilter != undefined && !priceFilter.includes(String(data[index].price))) {
              data.splice(index, 1);
            }
            index -= 1;
          }

          index = data.length - 1

          while (index >= 0) {
            if (typeFilter != undefined && !data[index].tag.some(element => (typeFilter.includes(element)))) {
              data.splice(index, 1);
            }
            index -= 1;
          }

          index = data.length - 1

          while (index >= 0) {
            if (mealFilter != undefined && !data[index].tag.some(element => (mealFilter.includes(element)))) {
              data.splice(index, 1);
            }
            index -= 1;
          }

        if (sortBy == 'price')
          data.sort(comparePrice)
        else if (sortBy == 'distance')
          data.sort(compareDist)
        
        //console.log(data)
        res.status(200).send({ message: 'success', contents: data })
    })
    
    // TODO Part II-2-a: revise the route so that the result is filtered with priceFilter, mealFilter and typeFilter
    // TODO Part II-2-b: revise the route so that the result is sorted by sortBy
}

exports.GetInfo = async (req, res) => {
    /*******    NOTE: DO NOT MODIFY   *******/
    const id = req.query.id
    /****************************************/

    // NOTE USE THE FOLLOWING FORMAT. Send type should be 
    // if success:
    // {
    //    message: 'success'
    //    contents: the data to be sent. Hint: A dictionary of the restaruant's information.
    // }
    // else:
    // {
    //    message: 'error'
    //    contents: []
    // }

    // TODO Part III-2: find the information to the restaurant with the id that the user requests

    Info.find({id : id}).exec((err, data) => {
        if (err)
          res.status(403).send({ message: 'error', contents: "error" })
        //console.log(data)
        res.status(200).send({ message: 'success', contents: data })
    })
}