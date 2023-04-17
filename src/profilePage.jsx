import { useLayoutEffect, useState } from "react";
import { queryFireStore } from './firebaseConfig.js'

export default function ProfilePage(){
  const currentUser = localStorage.getItem('email')
  const [userObject, setUserObject]= useState('Loading...')
  const [cords, setCords] = useState('Loading...')

    useLayoutEffect(() => {
        queryFireStore('users').then(data => {
            const fetchedUser = data.filter((user)=>{
              return user.userId == currentUser
            })
            setUserObject(fetchedUser[0])
            setCords(fetchedUser[0].hospitalCords)
        })
    }, [])
  return(
    <div className="profilePage">
      <div className="profileView">
        {
          (localStorage.getItem('email') == 'Guest')?

          <>
            <h2>ID:               <span>No data, youre a guest</span></h2>
            <p>Institution:       <span>#</span></p>
            <p>Institution email: <span>#</span></p>
            <p>lat :              <span>#</span></p>
            <p>lng:               <span>#</span></p>
          </>
          :
          <>
            <h2>ID:               <span>{userObject.userId}</span></h2>
            <p>Institution:       <span>{userObject.institution}</span></p>
            <p>Institution email: <span>{userObject.institutionEmail}</span></p>
            <p>lat :              <span>{cords.lat}</span></p>
            <p>lng:               <span>{cords.lng}</span></p>
          </>
        }
      </div>
    </div>
  )
}