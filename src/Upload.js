import { useEffect} from 'react';
import './Upload.css';
import ImageUpload from './ImageUpload';
import TextUpload from './TextUpload';


const Upload = ({username}) => {
    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
        
    }, []);
    
    return (
        <div className="container" id="container">
            <div className="form-container sign-up-container">
                <div className="form" >
                    <TextUpload username={username} />
                </div>
            </div>
            <div className="form-container sign-in-container">
                <div className="form" >
                    <ImageUpload username={username} />
                    
                </div>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Post Picture Or Video Here !</h1>
                        <p>Post your Moments Here</p>
                        <button className="ghost" id="signIn" className="btneffect">Click Here</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Want To Post Only Text ? </h1>
                        <p>Worry not!! Enter your text post and spread your thoughts</p>
                        <button className="ghost" id="signUp" className="btneffect">Click Here</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Upload;