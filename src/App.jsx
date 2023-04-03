import './App.scss';
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { queryFireStore } from './firebaseConfig';
import { verifyUser } from './firebaseConfig';

import PostsWindow from './postsWindow';
import MapPage from './MapPage';
import ComposeWindow from "./composeWindow";
import AdminPage from './adminPage';
import ProfilePage from './profilePage';


const loginFormHandlerCtx = createContext()

function NavigationBar() {
  /* #region variabls */
  const getCurrentEmail = localStorage.getItem('email')
  const getCurrentUser = localStorage.getItem('email').replace(/\@.*/, '')
  const mapPage = <button onClick={() => { setOpenPage(<MapPage />) }}>Map</button>
  let isAdmin = false;
  /* #endregion */
  /* #region functioons */
    const admins = ['murtatha']
    if (admins.includes(getCurrentEmail)) {
      isAdmin = true
    } else {
      isAdmin = false
    }
    const defaultPage = isAdmin? <PostsWindow/> : <PostsWindow byCurrentUser={true}/>

  function handleDrawerBtn() {
    document.getElementById('drawer').style.display = 'none'
    document.getElementById('hamburger').checked = false
  }
  /* #endregion */
  /* #region state */
  const [openPage, setOpenPage] = useState(defaultPage);
  /* #endregion */
  return (
    <>
      {/* NAVIGATION BAR */}
      <nav>
        {/* profile button */}
        <div className="profileCon" onClick={()=>{setOpenPage(<ProfilePage/>)}}>
          <div id="navUserPfp"> {getCurrentUser[0].toUpperCase()} </div>
          <p>{getCurrentUser}</p>
        </div>

        {/* Navigation buttons */}

          {
          !isAdmin ?
            <>
              <button onClick={() => { setOpenPage(<ComposeWindow />) }}>Compose</button>
              <button onClick={() => { setOpenPage(<PostsWindow isAdmin={isAdmin} byCurrentUser={true} />) }}>My posts</button>
            </>
              :
            <>
              <button onClick={() => { setOpenPage(<PostsWindow />) }}>Posts</button>
              <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<AdminPage />) }}>Admin</button>
              {mapPage}
            </>
          }

        <button onClick={() => {
          var confirmed = confirm('Are you sure you want to log out?');
          if (confirmed) {
            localStorage.clear()
            window.location.reload()
          }
        }}>Log out</button>
        <label className="hamburger">
          <input id='hamburger' type="checkbox" onClick={(e) => {
            if (!e.currentTarget.checked) {
              document.getElementById('drawer').style.display = 'none';
            } else {
              document.getElementById('drawer').style.display = 'flex';
            }
          }} />
        </label>
      </nav>
      {/* DISPLAYED PAGE */}
      <div className='drawerCon'>
        <aside id='drawer' className='sidebar'>
          {
            !isAdmin?
            <>
              <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<ComposeWindow />) }}>Compose</button>
              <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<PostsWindow isAdmin={isAdmin} byCurrentUser={true} />) }}>My posts</button>
            </>
            :
            <>
            <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<PostsWindow isAdmin={isAdmin} />) }}>Posts</button>
            <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<AdminPage />) }}>Admin</button>
            <button className='drawerBtn' onClick={() => { handleDrawerBtn(), setOpenPage(<MapPage />)
              console.log(document.querySelector('.mapViewCon'))
            }}>Map</button>
            </>
          } 
        </aside>
      </div>
      {openPage}
    </>

  )
}

function LoginForm({setUser}){
  /* #region states */
  const { handleSignIn } = useContext(loginFormHandlerCtx)
  const { setValue } = useContext(loginFormHandlerCtx)
  const [tagArray, setTagArray] = useState([])
  const tagInput = useRef(null)
  const passwordInput = useRef(null)
  const loginBtn = useRef(null)
  /* #endregion */

  /* #region data */
  useLayoutEffect(() => {
    const tags = []
    queryFireStore('users').then(data => {
      data.forEach((user) => {
        tags.push(user.tag)
      })
      setTagArray(tags)
    })
  }, [])
  useEffect(()=>{
    document.addEventListener('keydown', (input)=>{
      (input.key == 'Enter')? loginBtn.current.click() : null
    })
  },[])
  /* #endregion */

  return (
    <div className="loginFormCon">
      <div className="loginForm">
        <h3>Provide the tag and password <br/>  given to you by an admin</h3>
        <div className="inputs">
          <form>
            <input ref={tagInput} type="text" placeholder='Tag' />
            <input ref={passwordInput} type="password" placeholder='Password' />
          </form>
          <button ref={loginBtn} onClick={() => {
            const tagInputValue = tagInput.current.value;
            const passwordInputValue = passwordInput.current.value;

            if (tagInputValue!='' && passwordInputValue!='') {
              verifyUser(tagInputValue, passwordInputValue).then((result)=>{
                if (result){
                  setUser(tagInputValue)
                  localStorage.setItem('email', tagInputValue)
                }else{
                  alert('Wrong tag or password');
                }
              })
            }else{alert('You need to fill both fields')}

          }}>Login</button>
        </div>
      </div>
    </div>
  )
}

function MainView() {
  const [User, setUser] = useState(false)
  // check if user logged in before
  useEffect(()=>{
    if (localStorage.getItem('email') != null){
      setUser(localStorage.getItem('email'))
    }
  },[])

  return (
    User ?
      <NavigationBar />
      :
      <loginFormHandlerCtx.Provider value={{setUser:setUser, User:User}}>
        <LoginForm setUser={setUser} />
      </loginFormHandlerCtx.Provider>
  )
}

/* -------------------------------------------------------------------------- */
function App() {
  return (
    <MainView />
  )
};
export default App