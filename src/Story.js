import React from 'react';
import './Story.css';

function Story({img,username}) {
    return (
        <div className="story">
            <img src={img} alt="" className="storyimage"/>
            <p className="storyname">{username}</p>
        </div>
    )
}

export default Story;
