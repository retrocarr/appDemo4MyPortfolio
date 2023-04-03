import { useLoadScript, GoogleMap, MarkerF, Marker } from "@react-google-maps/api"
import { createContext, useMemo } from "react";
import React from 'react';
import { query } from "firebase/database";
import { getDoc, doc, getDocs, getFirestore, collection } from 'firebase/firestore'
import { useEffect, useState } from "react";

const CHOSEN_QUERY = 'posts'

function MapPost({ post, handleclick }) {
  console.log(post);
  return (
    <div key={post.id} className="post"
      id={post.id} onClick={(e) => {
        handleclick();
        document.querySelectorAll('.post').forEach((post) => {
          post.style.backgroundColor = 'white'
        })
        e.currentTarget.style.backgroundColor = '#d3d3d3'
      }}>

      <div>
        <div className="userPfp">{post.poster[0]}</div>
        <span>{post.poster}</span>
        <span className="date">{post.date}</span>
      </div>
      <h2>{post.header}</h2>
      <p>{post.text}</p>
    </div>
  )
}

function MapPostsView() {
  const [fetchedData, setFetchedData] = useState([])
  const [displayedMapPost, setDisplayedMapPost] = useState(fetchedData[0])

  async function queryFireStore() {
    const firestore = getFirestore()
    const postsQuery = query(
      collection(firestore, CHOSEN_QUERY),)
    const querySnapeShot = await getDocs(postsQuery);
    const dataArray = [];
    querySnapeShot.forEach((snap) => {
      dataArray.push(snap.data());
    });
    setFetchedData(dataArray);
  }
  useEffect(() => { queryFireStore(); }, [])


  return (
    <div className="postsSmallView">
      <span className="allPostsHeader">
        <h3>AllPosts</h3>
        <h3>{fetchedData.length} Posts</h3>
      </span>

      <MapPost />
      {
        fetchedData.map(post =>
          <div key={post.id}>
            <MapPost post={post} handleclick={(e) => {
              setDisplayedMapPost(post)
            }} />
          </div>
        )
      }
    </div>
  )
}

export default function MapPage() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: 'AIzaSyBSm9IqSjMrzg_cvffa29HUC4tV65pVJM4' })

  if (!isLoaded) {
    return <p>LOADING...</p>;
  }
  return (
    <>
      <div className="mapViewCon">
        {/* <MapPostsView /> */}
        <div className="mapCon">
          <MapPostsVIew />
          <Map></Map>
        </div>
      </div>
    </>
  )
}

function UserMarker({ email }) {
  /* #region states */
  const [fetchedEmailCords, setFetchedEmailCords] = useState([])
  /* #endregion */

  /* #region functioons */
  async function queryFireStore() {
    const firestore = getFirestore()
    const postsQuery = query(doc(firestore, 'All emails/' + email),)
    const querySnapeShot = await getDoc(postsQuery);
    setFetchedEmailCords(querySnapeShot.data())
    console.log(querySnapeShot.data());
  }
  /* #endregion */

  useEffect(() => { queryFireStore(); }, [])

  return (
    <MarkerF label={email[0]} position={fetchedEmailCords} onClick={()=>{
      alert(email)
    }} />
  )
}

function Map() {
  /* #region states */
  const center = useMemo(() => ({ lat: 30.517318, lng: 47.758834 }), []);
  const [fetchedData, setFetchedData] = useState([])
  /* #endregion */

  /* #region functioons*/
  async function queryFireStore() {
    const firestore = getFirestore()
    const postsQuery = query(
      collection(firestore, 'posts'),)
    const querySnapeShot = await getDocs(postsQuery);
    const dataArray = [];
    querySnapeShot.forEach((snap) => {
      dataArray.push(snap.data());
    });
    setFetchedData(dataArray);
  }
  useEffect(() => { queryFireStore(); }, [])
  /* #endregion */

  return(
    <GoogleMap zoom={9} center={center} mapContainerClassName='MAP'> 
      <UserMarker email={'retrocar132@gmail.com'} />
    </GoogleMap>
  )
}
