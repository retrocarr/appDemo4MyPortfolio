import { useLayoutEffect, useState } from "react"
import { useRef } from "react"
import { queryFireStore } from "./firebaseConfig"
import { writeNewUser } from "./firebaseConfig"
import { deleteDocument } from "./firebaseConfig"
import { updateUserRecord } from "./firebaseConfig"

function CreateNewUser() {
    /* #region states */
    const newBtn = useRef(null);
    let cardIsOpen = false;
    const fetchNewUserCard = document.getElementById('newUserCard');
    /* #endregion */

    /* #region logic */
    function handleClick() {
        if (!cardIsOpen) {
            newBtn.current.innerHTML = 'Cancel'
            fetchNewUserCard.style.display = 'flex'
            cardIsOpen = !cardIsOpen
        } else {
            newBtn.current.innerHTML = 'Create new user'
            fetchNewUserCard.style.display = 'none'
            cardIsOpen = !cardIsOpen
        }
    }
    /* #endregion */

    return (
        <>
            <div className="newUserBtnCon">
                <button ref={newBtn} onClick={handleClick}>Create new user</button>
            </div>
        </>
    )
}

function NewUserCard() {
    const [userIdplaceholder, setUserIdPlaceholder] = useState('Enter an ID')
    const createUserBtn = useRef(null)
    /* #region use refs */
    const newId                 = useRef(null)
    const newPassword               = useRef(null)
    const newInstitution                = useRef(null)
    const newInstitutionEmail               = useRef(null)
    const newLat                = useRef(null)
    const newLng                = useRef(null)
    /* #endregion */

    function dataInputsAreEmpty() {
        if (
            newId.current.value == '' &&
            newPassword.current.value == '' &&
            newInstitution.current.value == '' &&
            newInstitutionEmail.current.value == '' &&
            newLat.current.value == '' &&
            newLng.current.value == ''
        ) { return true } else { return false }
    }

    function handleChange() {
        if(!dataInputsAreEmpty()){
            createUserBtn.current.style.opacity = '100%'
            createUserBtn.current.style.cursor = 'pointer'
        } else {
            createUserBtn.current.style.opacity = '50%'
            createUserBtn.current.style.cursor = 'default'
        }
    }

    async function handleCreateUserRequest(){
        await writeNewUser(
            newId.current.value,
            newPassword.current.value,
            newInstitution.current.value,
            newInstitutionEmail.current.value,
            Number(newLat.current.value),
            Number(newLng.current.value)
        )
        location.reload()
    }

    function handleClick(){
        if (!dataInputsAreEmpty()) {
            var confirmed = confirm('Are you sure you want to create this user record?');
            if (confirmed) {
                handleCreateUserRequest()
            }
        }
    }

    return (
        <div id="newUserCard" className="userCon newUserCon">

            <h2>{userIdplaceholder}</h2>

            <div>
                <p>User ID:</p>
                <input ref={newId} onChange={(e) => {
                    (e.target.value != '') ?
                        setUserIdPlaceholder(e.target.value) : setUserIdPlaceholder('Enter an ID')
                        handleChange()
                }} />
            </div>

            <div >
                <p>User password:</p>
                <input onChange={handleChange} ref={newPassword} />
            </div>

            <div >
                <p>Health institution:</p>
                <input onChange={handleChange} ref={newInstitution} />
            </div>

            <div >
                <p>Health institution email:</p>
                <input onChange={handleChange} ref={newInstitutionEmail} />
            </div>

            <div>
                <p>Map cordinations:</p>
                <input type='number' onChange={handleChange} ref={newLat} />
                <input type='number' onChange={handleChange} ref={newLng} />
            </div>

            <button ref={createUserBtn} onClick={handleClick}>Create</button>

        </div>
    )
}
<div className="Info">NOTE: you cannot login with the users</div>
function UserContainer({dbRef, userId, password, institution, institutionEmail, lat, lng}) {
    /* #region states */
    const updateBtn = useRef(null)
    /* #endregion */

    /* #region data references */
    const previousLat = lat;
    const previousLng = lng;
    const previousUserId = userId;
    const previousPassword = password;
    const previousInstitution = institution;
    const previousInstitutionEmail = institutionEmail;
    /* #endregion */
    /* #region element references */
    const userIdInput = useRef(null);
    const passwordInput = useRef(null);
    const institutionInput = useRef(null);
    const institutionEmailInput = useRef(null);
    const latInput = useRef(null);
    const lngInput = useRef(null);
    /* #endregion */

    /* #region [orange] funcions */

    function dataInputsUnchanged() {
        if (
            latInput.current.value == previousLat &&
            lngInput.current.value == previousLng &&
            userIdInput.current.value == previousUserId &&
            passwordInput.current.value == previousPassword &&
            institutionInput.current.value == previousInstitution &&
            institutionEmailInput.current.value == previousInstitutionEmail
        ) { return true } else { return false }
    }

    function handleChange() {
        if (dataInputsUnchanged()) {
            updateBtn.current.style.opacity = '50%'
        } else {
            updateBtn.current.style.opacity = '100%'
        }
    }

    async function handleUpdate() {
        if (!dataInputsUnchanged()) {
            var confirmed = confirm('Are you sure you want to update this users record?');
            if (confirmed) {
                await updateUserRecord(
                    dbRef,
                    userIdInput.current.value,
                    passwordInput.current.value,
                    institutionInput.current.value,
                    institutionEmailInput.current.value,
                    Number(latInput.current.value),
                    Number(lngInput.current.value)
                )
                window.location.reload()
            }
        }
    }

    async function handleDelete(){
        var confirmed = confirm('Are you sure you want to delete this use?');
        if (confirmed) {
            await deleteDocument('users/'+dbRef)
            console.log(dbRef);
            window.location.reload()
        }
    }

    /* #endregion */

    return (
        <div className="userCon">

            <button className="deleteBtn" onClick={handleDelete}>delete</button>
            <h2>{userId}</h2>

            <div>
                <p>User ID:</p>
                <input ref={userIdInput} type="text" defaultValue={userId} onChange={handleChange} />
            </div>

            <div >
                <p>User password:</p>
                <input ref={passwordInput} type='text' defaultValue={password} onChange={handleChange} />
            </div>

            <div >
                <p>Health institution:</p>
                <input ref={institutionInput} type='text' defaultValue={institution} onChange={handleChange} />
            </div>

            <div >
                <p>Health institution email:</p>
                <input ref={institutionEmailInput} type='text' defaultValue={institutionEmail} onChange={handleChange} />
            </div>

            <div>
                <p>Map cordinations:</p>
                <input ref={latInput} type="number" defaultValue={lat} onChange={handleChange} />
                <input ref={lngInput} type="number" defaultValue={lng} onChange={handleChange} />
            </div>

            {/* <div className="adminCheck">
                <p>Admin?</p>
                <select>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </select>
            </div> */}

            <button ref={updateBtn} onClick={handleUpdate}>Update</button>

        </div>
    )
}

export default function AdminPage() {
    /* #region  */
    const [users, setUsers] = useState([])

    useLayoutEffect(() => {
        queryFireStore('users').then(data => {
            setUsers(
                data.map(user =>
                    <UserContainer key={user.docId}
                        dbRef={user.docId}
                        userId={user.userId}
                        password={user.password}
                        institution={user.institution}
                        institutionEmail={user.institutionEmail}
                        lat={user.hospitalCords.lat}
                        lng={user.hospitalCords.lng} />
                ))
        })
    }, [])
    /* #endregion */

    return (
        <>
            <div className="usersPage">
                <CreateNewUser />
                <div className="allUsersContainer">
                    <NewUserCard />
                    {users}
                </div>
            </div>
        </>
    )
}