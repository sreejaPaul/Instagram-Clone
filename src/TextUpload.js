import { Button} from '@material-ui/core';
import React, { useState } from 'react';
import { db } from './firebase';
import firebase from "firebase/compat/app";
import './TextUpload.css';
import Picker from 'emoji-picker-react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {useHistory} from 'react-router-dom';

function TextUpload({ username }) {
    const [inputStr, setInputStr] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [caption,setCaption] = useState('');
    const history = useHistory();

    const onEmojiClick = (event, emojiObject) => {
        setInputStr(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };
    const handleTextUpload = (event) => {
        if (inputStr !== "" && caption !== "") {

            event.preventDefault();

            db.collection("posts").add({
                text: inputStr,
                username: username,
                caption: caption,
                imageUrl: "text",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setInputStr("");
            setCaption("");
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            history.push("/")
        }
    }

    return (
        <div className="text_upload">
            <div className="picker-container">
            <input
                    className="text_caption"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write Caption Here..."
            />
                    
            </div>
            <div className="picker-container">
                <textarea
                    className="input-style"
                    value={inputStr}
                    onChange={e => setInputStr(e.target.value)}
                    placeholder="Write Your Post Here..."
                />
                <img
                    className="emoji-icon"
                    src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                    onClick={() => setShowPicker(val => !val)} alt=""/>
                {showPicker && <Picker
                    pickerStyle={{ width: '100%' }}
                    onEmojiClick={onEmojiClick} />}

                {(inputStr !== "" && caption !== "") ?
                    <Button className="imageupload_button" onClick={handleTextUpload}>
                        Upload Post
                    </Button>
                    :
                    <Popup trigger={
                        <Button className="imageupload_button">
                            Upload Post
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

        </div>
    );
}

export default TextUpload;
