import React,{useEffect,useState} from 'react';
import faker from 'faker';
import Story from './Story';
import './Stories.css';

function Stories({dark}) {
    const [suggestions,setSuggestions] = useState([]);
    
    useEffect(() => {
        const suggestions = [...Array(25)].map((_, i) => ({
            ...faker.helpers.contextualCard(),
            id: i,
            avatar: `https://i.pravatar.cc/150?u=${i}` // Generate a unique avatar for each suggestion
        }));
        setSuggestions(suggestions);
    }, []);
    return (
        <div className= {dark ? "stories dark-mode" : "stories"}>
            {suggestions.map((profile) => (
                <Story key={profile.id} img={profile.avatar} username={profile.username}  />
            ))}
        </div>
    )
}

export default Stories
