import React, {useState, useEffect} from 'react';
import './App.css';
import Post from "./Post" 
import {db ,auth} from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal";
import {Button,Input} from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';



/**MATERIAL UI STYLES */
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
/**END OF MODAL STYLING */

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle)
  const [posts,setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  /*LOGIN HOOKS */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /*AUTH HOOK*/
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        setUser(authUser)
      }else{
        //user has logged out...
        setUser(null)
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe()
    }

  },[user,username])

  //useEffect : Runs a specific code based on a specific condition
  useEffect(() => {
    //this is where te code runs

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
      //EVERY SINGLE TIME A NEW POST IS ADDED/UPDATED, THIS CODE FIRES
      setPosts(snapshot.docs.map(doc => ({id : doc.id,post : doc.data() })))
    })
    
  },[])
  
  const signUp = (event) => {
      event.preventDefault();
    
      //AUTH and user from firebase
      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser) =>{
        return authUser.user.updateProfile({displayName : username})
      })
      .catch((err) => alert(err.message))
      //Close the modal
      setOpen(false)
  }
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }


  return (
    <div className="app">
      

      <Modal
        open={open}
        onClose={ ()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram logo"
            />
          </center>
          <form className="app__signup">
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}> Sign Up!</Button>
          </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={ ()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram logo"
            />
          </center>
          <form className="app__signup">
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}> Sign In!</Button>
          </form>
          
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram logo"
        />
        {/*Sign In/Sign Up and Logout control*/}
        {user ? (
          <Button onClick={() => auth.signOut()}>Logut</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}

      </div>
     
      <div className="app__posts">
        <div className="app__postsLeft">
          
          {user?.displayName && (<ImageUpload username={user.displayName}/>) }
          {posts.map(({id,post}) => (
            <Post 
              key={id}
              postId={id}
              user={user}
              username={post.username} 
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            className="instagram__embed"
            url='https://www.instagram.com/p/CCkM6SBJZOs/'
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          <p className="footer__info" >Información Ayuda Prensa API Empleo Privacidad Condiciones Ubicaciones Cuentas destacadas Hashtags Idioma Español</p>
          <p className="footer__info">© 2020 INSTAGRAM FROM FACEBOOK</p>
        </div>
      </div>
      



    </div>
  );
}

export default App;
