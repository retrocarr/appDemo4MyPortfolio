import React, { useRef } from 'react';
import { query } from "firebase/database";
import { getDocs, getFirestore, collection } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from "react";
import { deleteDocument } from './firebaseConfig';


const CHOSEN_QUERY = 'posts'

const postCtx = createContext()

/* #region [red] 1 post component */
function Post({ post, handleclick}) {
  const currentUser = localStorage.getItem('email').replace(/\@.*/, '');
  const dotMenuRef = useRef(null)
  let menuShown = false


  async function deleteThisPost(){
    await deleteDocument('posts/' + String(post.id))
    location.reload()
  }

  return (
    <>
      <div key={post.id} id={post.id}
        className='post' onClick={(e) => {
          handleclick();
          document.querySelectorAll('.post').forEach((post) => {
            post.style.backgroundColor = 'white'
          })
          e.currentTarget.style.backgroundColor = '#d3d3d3'
        }}>

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
          <div className="dotMenu" ref={dotMenuRef}>
            <button className='delPostBtn' onClick={()=>{
              var confirmed = confirm('Are you sure you want to delete this post?');
              if (confirmed) {
                deleteThisPost()
              }
            }}>Delete</button>
          </div>
        </div>
        <h2>{post.header}</h2>
        <p>{post.text}</p>
      </div>
    </>
  )
}
/* #endregion */

/* #region [orange] displayed */
function PostsBigView() {
  const { displayedPost } = useContext(postCtx)

  return (
    <div className="postsBigView">
      <label>
        <span id="displayedUserName">{displayedPost.poster}</span>
        <span id="displayedDate">{displayedPost.date}</span>
      </label>
      <h1 id="displayedHeader">{displayedPost.header}</h1>
      <p id="displayedText">{displayedPost.text}</p>
    </div>
  )
}

function PostsSmallView() {
  const { posts } = useContext(postCtx)
  const { setDisplayedPost } = useContext(postCtx)

  return (
    <div className="postsSmallView">
      {/* check if there are any posts */}
      {(posts.length > 0) ?
        <span className="allPostsHeader">
          <h5>All Posts</h5>
          <h5> ({posts.length})</h5>
        </span> : <h1 id="noPostsHeader">No posts yet</h1>
      }

      {/* Map data */}
      {posts.map(post =>
        <div key={post.id}>
          <Post post={post} handleclick={() => {
            setDisplayedPost(post)
          }} />
        </div>
      )}
    </div>
  )
}

function AllPosts({posts}) {
  const ChooseApostToDisplay = {
    header: 'Choose a post to display',
    text: '',
    id: 1,
    poster: ''
  }
  const [displayedPost, setDisplayedPost] = useState(ChooseApostToDisplay);

  return (
    <postCtx.Provider value={{ posts: posts, displayedPost: displayedPost, setDisplayedPost: setDisplayedPost }}>
      <PostsSmallView  />
      <PostsBigView />
    </postCtx.Provider>
  )
}
/* #endregion */

export default function PostsWindow({ byCurrentUser }) {

  /* #region variables */
  const currentUser = localStorage.getItem('email').replace(/\@.*/, '');
  /* #endregion */

  /* #region [red] PLACE HOLDER DATA DELETE LATER */
  const OLDfetchedData = [
    {
      date: 'DATE HERE',
      header: 'HEADER 1 HERE',
      text: 'SOME TEXT HEREEEEEEEEEEEEEEEEEE',
      id: 1,
      poster: 'retrocar132'
    },
    {
      date: 'DATE HERE',
      header: 'HEADER 2 HERE',
      id: 2,
      poster: 'retrocar132'
    }
  ]
  /* #endregion */

  /* #region [yellow] create array from firestore database */
  const [fetchedData, setFetchedData] = useState([])
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
  /* #endregion */

  return (
    (fetchedData.length > 0) ?
      <div className='postViewContainer'>
        {
          (byCurrentUser) ?
            <AllPosts  posts={fetchedData.filter((post) => {
              return post.poster == currentUser;
            })} />
            :
            <AllPosts posts={fetchedData} />
        }
      </div>
      : <div id="noPostsHeader"><h1>No posts yet </h1></div>
  )
}
