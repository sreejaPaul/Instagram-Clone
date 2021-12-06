import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Stories from './Stories';
import { useHistory, Route, Link } from 'react-router-dom';
import Upload from './Upload';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Profilepage from './Profilepage';
import useCustomNotificationHandler from './useCustomNotificationHandler';
import Footer from './Footer';

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
  loginBtn: {
    width: "150px",
    marginLeft: "8px",
    marginRight: "8px",
    border: "1px solid grey",
    borderRadius: "5px",
  },
  button: {
    width: "100px",
    marginLeft: "8px",
    marginRight: "8px",
    border: "1px solid grey",
    borderRadius: "5px",
  },
  icon:{
    padding:"2px 5px 0px 0px"
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [guestEmail, setGuestEmail] = useState("MyGuest@gmail.com");
  const [guestPassword,setGuestPassword] = useState("MyGuest*1234");
  const history = useHistory();
  const { setMessage, setMessageColor, CustomNotification } = useCustomNotificationHandler(800);
  const getMode = ()=>{
    return JSON.parse(localStorage.getItem("mode")) || false;
  }
  const [dark,setMode] = useState(getMode());

  const darkBtn ={
    color:"rgb(211, 203, 203)"
  }
  const darkButton ={
    color: "rgb(211, 203, 203)",
    width: "150px",
    border: "1px solid grey",
    borderRadius: "5px",
  }
  const button ={
    width:"150px",
    border: "1px solid grey",
    borderRadius: "5px",
  }
  const upButton={
    border: "1px solid grey",
    borderRadius: "5px",
    marginLeft:"33%",
    marginBottom: "10px"
  }
  const darkUpButton ={
    color: "rgb(211, 203, 203)",
    border: "1px solid grey",
    borderRadius: "5px",
    marginLeft:"33%",
    marginBottom: "10px"
  }

  useEffect(()=>{
    localStorage.setItem("mode",JSON.stringify(dark))
  },[dark])

  useEffect(()=>{
    console.log(user)
  },[user])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);



  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    setMessage("Sign Up In Process");
    setMessageColor("info");
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
    setEmail("");
    setUsername("");
    setPassword("");
    history.push("/");
  }

  const signIn = (event) => {
    event.preventDefault();
    setMessage("Login In Process");
    setMessageColor("info");
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setEmail("");
    setUsername("");
    setPassword("");
    history.push("/");
  }

  const GuestLogin = (event)=>{
    event.preventDefault();
    setMessage("Login In Process");
    setMessageColor("info");
    auth.signInWithEmailAndPassword(guestEmail, guestPassword)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setEmail("");
    setUsername("");
    setPassword("");
    history.push("/");
  }
  const themeSelect = ()=>{
    console.log("click " + dark)
    setMode(!dark);
  }
  const scrollToTop = ()=> {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  const logOut = ()=>{
    setMessage("Logging Out");
    setMessageColor("info");
    history.push("/");
    auth.signOut();
  }
  return (
    <div className={dark ? "App dark-mode" : "App"}>
        <Route path="/" exact>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app_signup">
                <center>
                  <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="insta" className="app_headerImage"/>
                </center>
                <Input
                  type="text"
                  placeholder="username"
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
                <Button onClick={signUp}>Sign Up</Button>
              </form>
            </div>
          </Modal>

          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app_signup">
                <center>
                  <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="insta" className="app_headerImage" />
                </center>
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
                <Button onClick={signIn}>Sign In</Button>
              </form>
            </div>
          </Modal>
          <div className= {dark ? "app_header dark-header" : "app_header"}>
            <div className="leftSide">
              <Link to="/">
              <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="Logo" className="app_headerImage"/>
              </Link>
            </div>
            <div style={{display: "flex",marginTop: "5px"}}>
              <div>
                {user ?
                (
                  <div className="app_loginContainer">
                    <Button style={dark?darkButton:button} onClick={()=>history.push(`/${user.displayName}`)}>Profile</Button>
                    <Button onClick={logOut} style={dark?darkBtn:{}} className={classes.button}>{"Log Out"}</Button>
                  
                  </div>) :
                  <div className="app_loginContainer">
                    <Button onClick={GuestLogin} style={dark?darkBtn:{}} className={classes.loginBtn}>Guest Login</Button>
                    <Button onClick={() => setOpen(true)} style={dark?darkBtn:{}} className={classes.button}>Sign Up</Button>
                    <Button onClick={() => setOpenSignIn(true)} style={dark?darkBtn:{}} className={classes.button}>Sign In</Button>
            
                  </div>}
              </div>
              <div className="navtoggle">
                  <label className="switch">
                    <input type="checkbox" checked={dark} onChange={themeSelect}/>
                    <span className="slider round"></span>
                  </label>
              </div>
            </div>
          </div>

          {user ?
            <div className="app_stories">
              <Stories dark={dark}/>
            </div> : ""}

          <div className="app_posts">
            <div className="app_postLeft">
              {posts.map(({ post, id }) => {
                return <Post key={id} postId={id} user={user} imageUrl={post.imageUrl} imagename={(post.imagename !== undefined) ? post.imagename : ""} username={post.username}
                  caption={post.caption} timestamp={post.timestamp} text={(post.text !== undefined) ? post.text : ""} dark={dark}/>
              })}
            </div>
            <div className="app__postsRight no-mobile">


            </div>
          </div>


          {(user) ?
            // <ImageUpload username={user?.displayName} />
            <>
            <div>
              <Button style={dark?darkUpButton:upButton}onClick={scrollToTop}>{"Looked Like You Reached To The End.See What Your Friends' Are Doing"}</Button>
            </div>
            </> 
            : (<div className="or_display"><h3>Login / Signup To Upload Post Or Comment On Any Post</h3></div>)}
            <div>
                <span style={{float:"right"}}>
                {"MADE BY Sreeja Paul"}
                </span>
            </div>
          <CustomNotification />
        </Route>
        <Route path="/:userName">
        <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app_signup">
                <center>
                  <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="insta" className="app_headerImage"/>
                </center>
                <Input
                  type="text"
                  placeholder="username"
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
                <Button onClick={signUp}>Sign Up</Button>
              </form>
            </div>
          </Modal>

          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app_signup">
                <center>
                  <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="insta" className="app_headerImage" />
                </center>
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
                <Button onClick={signIn}>Sign In</Button>
              </form>
            </div>
          </Modal>
          <div className= {dark ? "app_header dark-header" : "app_header"}>
            <div className="leftSide">
              <Link to="/" onClick={scrollToTop}>
              <img src="https://www.pngkey.com/png/full/43-432946_download-instagram-icon-black-circle-clipart-computer-black.png" alt="Logo" className="app_headerImage"/>
              </Link>
            </div>
            <div style={{display: "flex",marginTop: "5px"}}>
              <div>
                {user ?
                (
                  <div className="app_loginContainer">
                    <Button style={dark?darkButton:button} onClick={()=>window.scrollTo(0,document.body.scrollHeight)}><AddCircleIcon className={classes.icon}/> {"Create Post"}</Button>
                    <Button onClick={logOut} style={dark?darkBtn:{}} className={classes.button}>{"Log Out"}</Button>
                  
                  </div>) :
                  <div className="app_loginContainer">
                    <Button onClick={GuestLogin} style={dark?darkBtn:{}} className={classes.loginBtn}>Guest Login</Button>
                    <Button onClick={() => setOpen(true)} style={dark?darkBtn:{}} className={classes.button}>Sign Up</Button>
                    <Button onClick={() => setOpenSignIn(true)} style={dark?darkBtn:{}} className={classes.button}>Sign In</Button>
            
                  </div>}
              </div>
              <div className="navtoggle">
                  <label className="switch">
                    <input type="checkbox" checked={dark} onChange={themeSelect}/>
                    <span className="slider round"></span>
                  </label>
              </div>
            </div>
          </div>
          {user ?
          <Profilepage user={user} dark={dark}/>
          : (<div className="or_display"><h3>Login / Signup To See Profile</h3></div>)}
          <div>
            <span style={{float:"right"}}>
            {"MADE BY Sreeja Paul"}
            </span>
          </div>
          <CustomNotification />
        </Route>
      </div>
      );
}

      export default App;
