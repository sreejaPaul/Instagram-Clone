import { Button} from '@material-ui/core';
import React,{useState} from 'react';
import {storage,db} from './firebase';
import firebase from "firebase/compat/app";
import './ImageUpload.css';
import InputEmoji from 'react-input-emoji';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function ImageUpload({username}) {
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);


    const handlechange = (e)=>{
        // this will pick the FIRST file selected (to avoid selecting many)
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = ()=>{
        if(caption!=="" && image!==null){
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage.ref("images").child(image.name).getDownloadURL()
                .then(url=>{
                    //post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl : url,
                        imagename: image.name,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    document.body.scrollTop = 0; 
                    document.documentElement.scrollTop = 0; 
                })
            }
        )
        }
    }
    return (
        <div className="imageupload">

            <progress value={progress} max="100" className="imageupload__progress"/>
            <InputEmoji value={caption} onChange={setCaption} placeholder={"Enter a caption ..."} />
            <input type="file" onChange={handlechange}/>
            {(caption!=="" && image!==null && progress===0) ? 
            <Button className="imageupload_button" onClick={handleUpload}>
                Upload File
            </Button>
            :
            <Popup trigger={
                <Button className="imageupload_button" onClick={handleUpload}>
                    Upload File
                </Button>} modal>
                {close => (
                    <div className="modal" position="right center">
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="modaldiv"> {"Enter all the fields to continue"} </div>
                    </div>
                )}
            </Popup>}
        </div>
    )
}

export default ImageUpload;
