/****************************************************************************
  FileName      [ restaurantPage.js ]
  PackageName   [ src ]
  Author        [ Chin-Yi Cheng ]
  Synopsis      [ Implement the restaurant page ]
  Copyright     [ 2022 11 ]
****************************************************************************/

import React, { useState, useEffect } from 'react'
import '../css/restaurantPage.css'
import Information from './information';
import Comment from './comment';
import { useParams } from 'react-router-dom'

import axios from 'axios'
const instance = axios.create({
    baseURL: 'http://localhost:4000/api'
})

const RestaurantPage = () => {
    const { id } = useParams()
    const [info, setInfo] = useState({})
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const getInfo = async () => {
        // TODO Part III-2: get a restaurant's info
        const { data: {contents: [newInfo]}} = await instance.get('/getInfo', {
            params: {
              id : id
            }})
        setInfo(newInfo)
        console.log(newInfo)
    }

    const getComments = async () => {
        // TODO Part III-3: get a restaurant's comments 
        const { data: {contents: newComments}} = await instance.get('getCommentsByRestaurantId', {
            params: {
                restaurantId : id
            }})
        if (comments.length != newComments.length)
           setComments(newComments)
        console.log(newComments)
    }
    useEffect(() => {
        if (Object.keys(info).length === 0) {
            getInfo()
        }
    }, [])
    
    useEffect(() => {
        // TODO Part III-3-c: update the comment display immediately after submission
        getComments()
    }, [comments])


    /* TODO Part III-2-b: calculate the average rating of the restaurant */
    let rating = 0;
    comments.forEach(element => {
        rating += element.rating
    });
    if (comments.length != 0)
    rating = rating / comments.length
    
    return (
        <div className='restaurantPageContainer'>
            {Object.keys(info).length === 0 ? <></> : <Information info={info} rating={rating} />}
            <Comment restaurantId={id} comments={comments} setComments={setComments} setLoad={setLoading} />
        </div>
    )
}
export default RestaurantPage