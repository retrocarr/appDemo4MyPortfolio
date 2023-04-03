import {doc, getFirestore, setDoc} from 'firebase/firestore'
const firestore = getFirestore();
// const documentQuery = doc(firestore, 'posts/'+autoId())

function TodaysDate(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    const newdate = year + "/" + month + "/" + day;
    return newdate
}
function autoId(){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}
async function writeNewPost(header, text){
  const postId = autoId()
  const documentQuery = doc(firestore, 'posts/'+postId)
  const docData = {
    id:postId,
    date: TodaysDate(),
    poster:localStorage.getItem('email').replace(/\@.*/,''),
    email: localStorage.getItem('email'),
    header:header,
    text:text
  }
  await setDoc(documentQuery, docData)
}
/* -------------------------------------------------------------------------- */
export default function ComposeWindow(){
    async function handleClick(){
        const headerInput = document.querySelector('.headerInput')
        const textInput = document.querySelector('.textInput')
        if (headerInput.value !='' && textInput.value != ''){
          await writeNewPost(headerInput.value, textInput.value)
          location.reload()
          document.body.querySelector('*').style.cursor = 'wait';
        }else{
          alert('Both fields should be filled!')
        }

    }
    return(
        <div className="composeWindow">
            <span>
              <h2>create a post</h2>
              <button onClick={handleClick}>post</button>
            </span>
              <input placeholder="Issue Header..."    className="headerInput" type="text" />
              {/* <input type="File" id='postImgBtn' /> */}
            <textarea placeholder="Issue explaination(dont refresh the page)" className="textInput" type="text" />
        </div>
    )
}