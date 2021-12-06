import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { db } from './firebase';
import Post from "./Post";
import Upload from "./Upload";
import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

const Profilepage = ({user, dark})=>{
    const {userName} = useParams();
    const [posts, setPosts] = useState([]);
    const [profile,setProfile] = useState([]);
    const upButton={
      border: "1px solid grey",
      borderRadius: "5px",
      marginLeft:"41%",
      marginBottom: "10px"
    }
    const darkUpButton ={
      color: "rgb(211, 203, 203)",
      border: "1px solid grey",
      borderRadius: "5px",
      marginLeft:"41%",
      marginBottom: "10px"
    }
    const profileOwner = {
      display: "flex",
      width: "50%",
      marginLeft: "41%",
      marginTop:"41px"
    }
    const profileName={
      marginLeft: "2%",
      fontWeight: "bold",
    
    }
    const scrollToTop = ()=> {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
    
    useEffect(() => {
        db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
          setPosts(snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data()
          })));
        })
      }, []);
    
      useEffect(()=>{
        const userPost = posts.filter((data)=>{
            return data.post.username === userName
        })
        setProfile(userPost)
      },[posts]);
    return(
        <div>
          <div style = {profileOwner}>
              <div>
                <Avatar className="post_avatar" alt={user?.displayName || userName} />
              </div>
              <div style={profileName}>
                {userName + " Profile"}
              </div>
            </div>
          <div className="app_posts">
            
              <div className="app_postLeft">
                {(profile?.length>0) ?
                profile.map(({ post, id }) => {
                  return <Post key={id} postId={id} user={user} imageUrl={post.imageUrl} imagename={(post.imagename !== undefined) ? post.imagename : ""} username={post.username}
                    caption={post.caption} timestamp={post.timestamp} text={(post.text !== undefined) ? post.text : ""} dark={dark}/>
                }):
                <div className="or_display"><h3>{"You Have Not Posted Yet"}</h3></div>
                }
              </div>
            </div>
            <div>
              {(user && (user?.displayName===userName)) ?
              // <ImageUpload username={user?.displayName} />
              <>
                <Upload username={user?.displayName} />
                <div>
                  <Button style={dark?darkUpButton:upButton}onClick={scrollToTop}>{"Don't Want To Post Now? Click Here"}</Button>
                </div>
             </>
              : <div className="or_display"><h3>{"To Post Go To Your Own Profile"}</h3></div>}
            </div>

        </div>
    )
}
export default Profilepage;