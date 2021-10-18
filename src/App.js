import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Stories from './Stories';
import { useHistory, Route } from 'react-router-dom';
import Upload from './Upload';

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
  const history = useHistory();
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
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setEmail("");
    setUsername("");
    setPassword("");
    history.push("/");
  }
  return (
    <div className="App">
        <Route path="/" exact>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app_signup">
                <center>
                  <img src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00=w412-h220-rw" alt="insta" className="app_headerImage" />
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
                  <img src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00=w412-h220-rw" alt="insta" className="app_headerImage" />
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
          <div className="app_header">
            <img src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00=w412-h220-rw" alt="insta" className="app_headerImage" />
            {user ? (<Button onClick={() => auth.signOut()}>Log Out</Button>) :
              <div className="app_loginContainer">
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
                <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              </div>}
          </div>

          {user ?
            <div className="app_stories">
              <Stories />
            </div> : ""}

          <div className="app_posts">
            <div className="app_postLeft">
              {posts.map(({ post, id }) => {
                return <Post key={id} postId={id} user={user} imageUrl={post.imageUrl} imagename={(post.imagename !== undefined) ? post.imagename : ""} username={post.username}
                  caption={post.caption} timestamp={post.timestamp} text={(post.text !== undefined) ? post.text : ""} />
              })}
            </div>
            <div className="app__postsRight no-mobile">


            </div>
          </div>


          {(user) ?
            // <ImageUpload username={user?.displayName} />
            <Upload username={user?.displayName} />
            : (<div className="or_display"><h3>Login / Signup To Upload Post Or Comment On Any Post</h3></div>)}

        </Route>
      </div>
      );
}

      export default App;
