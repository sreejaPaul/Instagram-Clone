import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { auth, db } from './firebase';
import firebase from 'firebase/compat/app';
import MenuPopupState from "./MenuPopupState";
import InputEmoji from 'react-input-emoji';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { Link, useHistory } from 'react-router-dom';
import useCustomNotificationHandler from './useCustomNotificationHandler';

function Post({ postId, user, imageUrl, imagename, username, caption, timestamp,text ,dark}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [display, setDisplay] = useState("none");
    const [likes, setLikes] = useState([]);
    const [hasliked, setHasLiked] = useState(false);
    const { setMessage, setMessageColor, CustomNotification } = useCustomNotificationHandler(1000);
    const history = useHistory();

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    useEffect(() => {
        db
            .collection("posts")
            .doc(postId)
            .collection("likes")
            .onSnapshot((snapshot) => {
                setLikes(snapshot.docs);
            });
    }, [db, postId]);

    useEffect(() => {
        setHasLiked(likes.findIndex(like => like.id === user?.uid) !== -1)
    }, [likes]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
        

    }

    const deletePost = (postId) => {
        setMessage("Deleting Your Post")
        setMessageColor("warning");
        // event.preventDefault();

        db.collection("posts").doc(postId).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.log("Error removing document: ", error);
        });
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();

        // Create a reference to the file to delete
        var desertRef = storageRef.child('images/' + imagename);

        // Delete the file
        desertRef.delete().then(function () {
            // File deleted successfully

        }).catch(function (error) {
            // Uh-oh, an error occurred!
            console.log(error.message);
        });
    }
    const deleteTextPost = ()=>{
        setMessage("Deleting Your Post")
        setMessageColor("warning");
        db.collection("posts").doc(postId).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.log("Error removing document: ", error);
        });
    }

    const deleteComment = (commentToDel) => {
        setMessage("Deleting Your Comment")
        setMessageColor("warning");
        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .where("timestamp", "==", commentToDel)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
            });

    }

    const likepost = async (event) => {
        event.preventDefault();
        if (user) {
            if (hasliked) {
                await deleteDoc(doc(db, "posts", postId, "likes", user?.uid));
            } else {

                await setDoc(doc(db, "posts", postId, "likes", user?.uid), {
                    likeid: user?.uid,
                    username: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
        }


    }
    const commentClick = () => {
        if (display === "none")
            setDisplay("block");
        else if (display === "block"){
            setDisplay("none");
        }
    }
    const noUserDelete = ()=>{
        setMessage("Login/Signin First To Continue");
        setMessageColor("error");
    }
    const otherUserDelete = ()=>{
        setMessage("User Can Only Delete Their Own Posts");
        setMessageColor("error");
    }
    return (
        <div className={dark ? "post dark-mode" : "post"}>
            <div className="post_header">
                <div style={{flex: "1"}}>
                    <Link to= {"/" + username} style={{textDecoration:"none",color: "inherit"}}>
                    <>
                    <div style={{float:"left"}}>
                        <Avatar className="post_avatar" alt={user?.displayName} />
                        </div>
                        <div className="post__username"><h3>{username}</h3></div>
                    </>
                    </Link>
                </div>
                <div>
                {
                    (user)?
                    ((username === auth.currentUser?.displayName) ?
                    ((text==="") ?
                       <div className="delete__Post">
                           {/* This is where the 3 dots menu appear to delete posts */}
                           <MenuPopupState
                               datatopass={postId}
                               functiontopass={deletePost}
                               labeltopass={"Delete this post"}
                           />
                           
                       </div>
                       :
                       <div className="delete__Post">
                           {/* This is where the 3 dots menu appear to delete posts */}
                           <MenuPopupState
                               datatopass={postId}
                               functiontopass={deleteTextPost}
                               labeltopass={"Delete This Text Post"}
                           />
                           
                       </div>)
                   :<MenuPopupState
                        datatopass={postId}
                        functiontopass={otherUserDelete}
                        labeltopass={"Delete this post"}
                        user
                    />)
                    :
                    <MenuPopupState
                                datatopass={postId}
                                functiontopass={noUserDelete}
                                labeltopass={"Delete this post"}
                                user
                            />

                }
                </div>
            </div>


            <div className="post__imgcontainer">
                {
                    // video or pic
                    (imageUrl.includes(".mp4")) || (imageUrl.includes(".MP4")) || (imageUrl.includes(".mov")) || (imageUrl.includes(".MOV"))
                        ? (
                            <video width="100%" max-width="500" controls={true} autoPlay={true} loop={true} muted={true} playsInline={true}>
                                <source src={imageUrl} type='video/mp4'></source>
                                Your browser does not support the video tag.
                            </video>
                        )
                        :
                        (imageUrl.includes("text")) ?
                        (<div className="text_post">
                            {text}
                        </div>)
                        :
                        (
                            // If not video,then image
                            <img src={imageUrl} alt="" className="post_image" />
                        )
                }

            </div>
            <div className="icons">
                <div>
                    {(!user) ?
                        <Popup trigger={
                            <button className={dark ? "heart dark-mode" : "heart"}>
                                <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "gray" }} className="com" title="Like" />
                            </button>} modal>
                            {close => (
                                <div className="modal" position="right center">
                                    <button className="close" onClick={close}>
                                        &times;
                                    </button>
                                    <div className="modaldiv"> {"Login / SignUp to continue"} </div>
                                </div>
                            )}
                        </Popup>
                        :
                        (hasliked) ?
                            <span>
                                <button onClick={likepost} className={dark ? "heart dark-mode" : "heart"} >
                                    <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "red" }} className="com" title="Like" />
                                </button>
                            </span>
                            :
                            <span>
                                <button onClick={likepost} className={dark ? "heart dark-mode" : "heart"}>
                                    <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "gray" }} className="com" title="Like" />
                                </button>
                            </span>

                    }
                </div>
                <div>
                    <button className={dark ? "heart dark-mode" : "heart"} onClick={commentClick}>
                        <FontAwesomeIcon icon={faComment} size="2x" style={{ color: "gray" }} className="com" title="Comment" />
                    </button>
                </div>
            </div>
            <p className="noLike">{(likes.length>0)? <strong>{likes.length + ((likes.length >1 )?" Likes" : " Like")}</strong>: ""}</p>
            <h4 className="post_text">
                <strong>{username}</strong> {caption}
                <span className="time">
                    <Moment fromNow>
                        {timestamp?.toDate()}
                    </Moment>
                </span>
            </h4>
            <div className="full_comment" style={{ display: display }}>
                <div className="post__comments">
                    {comments.map((comment,index) => (
                        <div className="comment_container" key={index+comment.username}>
                            <div className="comment">
                                <p >
                                    <strong >
                                        {comment.username }:
                                    </strong>
                                    <span className="comText">{" " +comment.text}</span>
                                    <span className="time">
                                        <Moment fromNow>
                                            {comment.timestamp?.toDate()}
                                        </Moment>
                                    </span>
                                </p>
                            </div>
                            <div className="delete__CommentButton" >
                                {
                                    (user && comment.username === auth.currentUser.displayName)
                                    &&
                                    <div className="comment__morevert">

                                        {/* This is where the 3 dots menu appear to delete comments */}
                                        <MenuPopupState
                                            datatopass={comment.timestamp}
                                            functiontopass={deleteComment}
                                            labeltopass={"Delete this comment"}
                                        />
                                    </div>
                                }
                            </div>

                        </div>


                    ))}
                </div>
                {user && (
                    <form className="post__commentBox">

                        <InputEmoji value={comment} onChange={setComment} placeholder={"Add a comment and click post..."} />
                        <button
                            className="post__button" type="submit" onClick={postComment}
                        >
                            {"Post"}
                        </button>

                    </form>
                )}
            </div>
            <CustomNotification />
        </div>
    )
}

export default Post;
