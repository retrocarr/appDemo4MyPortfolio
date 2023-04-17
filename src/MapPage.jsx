import { useLoadScript, GoogleMap, Marker, MarkerF, InfoWindow } from "@react-google-maps/api"
import { useEffect, useLayoutEffect, useState, useMemo, createContext, useId, useRef } from 'react'
import { firebaseConfig, queryFireStore } from './firebaseConfig.js'
import bacteriaIcon from './assets/bacteria.png'
import { deleteDocument } from './firebaseConfig';

const markerCtx = createContext();
const env = import.meta.env.VITE_GOOGLE_API_KEY

function Post({ post }) {
  
  const dotMenuRef = useRef(null)
  let menuShown = false

  async function deleteThisPost(){
    await deleteDocument('posts/' + String(post.id))
    location.reload()
  }

  return (
    <>
      <div id={post.id}
        className='post mapPost'>
        <div>
          <div className="userPfp">{post.poster[0]}</div>
          <span>{post.poster}</span>
          <button onClick={()=>{
            if (menuShown){
              menuShown = !menuShown
              dotMenuRef.current.style.display = 'none'
            } else {
              menuShown = !menuShown
              dotMenuRef.current.style.display = 'flex'
            }
          }}>...</button>
          <span className='date'>{post.date}</span>
        </div>
          <div className="dotMenu" ref={dotMenuRef}>
            <button className='delPostBtn' onClick={()=>{
              var confirmed = confirm('Are you sure you want to delete this post?');
              if (confirmed) {
                deleteThisPost()
              }
            }}>Delete</button>
          </div>
        <h2>{post.header}</h2>
        <p>{post.text}</p>
      </div>
    </>
  )
}

function UserMarker({ cordinationsObject, email }) {
  /* #region states */
  const [infoWindow, setInfoWindow] = useState(null);
  const [markerPosts, setMarkerPosts] = useState(<h3>Loading...</h3>)
  const [markerStateIcon, setMarkerStateIcon] = useState(null)
  /* #endregion */

  useLayoutEffect(()=>{
    queryFireStore('posts').then(data =>{
      const mappedMarkerData = data.filter((post)=>{
        return email === post.email
      }). map(post =>{
        <Post key={post.id} post={post} />
      })
        if (mappedMarkerData.length > 0) {
          setMarkerStateIcon(null)
        } else {
          setMarkerPosts(null)
        }
    })
  },[])

  return (
    <>
      <Marker id={JSON.stringify(cordinationsObject)} position={cordinationsObject}
        options={{
          icon: markerStateIcon
        }}
        onClick={() => {
          setInfoWindow('yes')
          queryFireStore('posts').then(data => {
            const mappedMarkerData = data.filter((post) => {
              return email === post.email
            }).map(post =>
              <Post key={post.id} post={post} />
            )
            if (mappedMarkerData.length > 0) {
              setMarkerPosts(mappedMarkerData)
            } else {
              setMarkerPosts('No data for this hospital')
            }
          })

        }}
      >

        {infoWindow && (
          <InfoWindow onCloseClick={() => {
            setInfoWindow(null)
          }}>
            <div className="markerInfo">
              {markerPosts}
            </div>
          </InfoWindow>
        )}

      </Marker>
    </>
  )
}

function MapSection() {
  /* #region states */
  const center = useMemo(() => ({ lat: 30.517318, lng: 47.758834 }), []);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: env })
  const [markersArray, setMarkersArray] = useState('loading...')
  /* #endregion */

  /* #region get user emails */
  useLayoutEffect(() => {
    queryFireStore('users').then(data => {
      setMarkersArray(
        data.map(user =>
          <UserMarker key={user.userId} cordinationsObject={user.hospitalCords} email={user.userId} />
        ))
    })
  }, [])
  /* #endregion */

  if (!isLoaded) return <p>Loading...</p>
  return (
    <div className="mapCon">
      <GoogleMap
        zoom={9}
        maxZoom={1}
        center={{ lat: 39.10203229114012, lng: -94.58417716719654 }}
        mapContainerClassName='map'
      >
        {markersArray}
      </GoogleMap>
    </div>
  )
}

export default function () {
  /* #region states */
  const center = useMemo(() => ({ lat: 30.517318, lng: 47.758834 }), []);
  const [postDataArray, setPostDataArray] = useState('loading...')
  /* #endregion */

  /* #region data */
  useLayoutEffect(() => {
    queryFireStore('posts').then(data => {
      if(data.length > 0){
        setPostDataArray(data.map(post =>
          <Post key={post.id} post={post} />
          ))
        } else {
          setPostDataArray(<h1 id="noPostsHeader">No posts yet </h1>)
        }
    })
  }, [])
  /* #endregion */

  return (
    <div className="mapViewCon">
      <div className="mapPosts">
        {postDataArray}
      </div>
      <MapSection />
    </div>
  )
}