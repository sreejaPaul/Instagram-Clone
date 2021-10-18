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
import { useHistory } from 'react-router-dom';

function Post({ postId, user, imageUrl, imagename, username, caption, timestamp,text }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [display, setDisplay] = useState("none");
    const [likes, setLikes] = useState([]);
    const [hasliked, setHasLiked] = useState(false);
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
        history.push("/");


    }

    const deletePost = (postId) => {
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
        history.push("/");
    }
    const deleteTextPost = ()=>{
        db.collection("posts").doc(postId).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.log("Error removing document: ", error);
        });
        history.push("/");
    }

    const deleteComment = (commentToDel) => {
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
            history.push("/");

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
        else if (display === "block")
            setDisplay("none");
            history.push("/");
    }
    return (
        <div className="post">
            <div className="post_header">
                <Avatar className="post_avatar" alt={user?.displayName} />
                <div className="post__username"><h3>{username}</h3></div>
                {
                    (user && username === auth.currentUser.displayName && (text===undefined)) ?
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
                            labeltopass={"Delete this post"}
                        />
                        
                    </div>

                }
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
                            <button className="heart" >
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
                                <button onClick={likepost} className="heart" >
                                    <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "red" }} className="com" title="Like" />
                                </button>
                            </span>
                            :
                            <span>
                                <button onClick={likepost} className="heart" >
                                    <FontAwesomeIcon icon={faHeart} size="2x" style={{ color: "gray" }} className="com" title="Like" />
                                </button>
                            </span>

                    }
                </div>
                <div>
                    <button className="heart" onClick={commentClick}>
                        <FontAwesomeIcon icon={faComment} size="2x" style={{ color: "gray" }} className="com" title="Comment" />
                    </button>
                </div>
                <div>
                    <button className="heart">
                        <FontAwesomeIcon icon={faBookmark} size="2x" style={{ color: "gray" }} className="com" />
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

                        <InputEmoji value={comment} onChange={setComment} placeholder={"Add a comment..."} />
                        <button
                            className="post__button" type="submit" onClick={postComment}
                        >
                            {"Post"}
                        </button>

                    </form>
                )}
            </div>

        </div>
    )
}

export default Post;
