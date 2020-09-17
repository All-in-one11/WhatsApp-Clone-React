import React, { useState } from 'react';
import { useStateValue } from '../StateProvider';
import { toastInfo } from '../shared/toastInfo';
import TooltipCustom from '../shared/TooltipCustom';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { setDrawerBottom } from '../actions/drawerAction';
import DrawerBottom from './DrawerBottom';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PhotoIcon from '@material-ui/icons/Photo';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PersonIcon from '@material-ui/icons/Person';
import './ChatFooter.css';

const attachFileLists = [
    {
        title: "Room",
        icon: <VideoCallIcon />,
    },
    {
        title: "Contact",
        icon: <PersonIcon />,
    },
    {
        title: "Document",
        icon: <InsertDriveFileIcon />,
    },
    {
        title: "Camera",
        icon: <CameraAltIcon />,
    },
    {
        title: "Photos & Videos",
        icon: <PhotoIcon />,
    },
]

function ChatFooter( { roomName, roomId, db, firebase, storage }) {
    const [{ user },  dispatch] = useStateValue();
    const [input, setInput] = useState('');
    const [showAttachFile, setShowAttachFile] = useState(false);
    const [fileImageUrl, setFileImageUrl] = useState(null);
    const [fileVideoUrl, setFileVideoUrl] = useState(null);

    const sendMessage = (e) => {
        e.preventDefault();
        const youtubeLink = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        const facebookVideoLink = /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;

        if(roomId){
            if(youtubeLink.test(input) || facebookVideoLink.test(input)){
                console.log("YOUTUBE LINK VALID");
                db.collection("rooms").doc(roomId).collection('messages').add({
                    video: input,
                    name: user.displayName,
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    db.collection("rooms").doc(roomId).collection('messages').doc(docRef.id).set({
                        id: docRef.id
                    },{ merge: true });
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }else{
                db.collection("rooms").doc(roomId).collection('messages').add({
                    message: input,
                    name: user.displayName,
                    uid: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    db.collection("rooms").doc(roomId).collection('messages').doc(docRef.id).set({
                        id: docRef.id
                    },{ merge: true });
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            }
        }
        setInput("");
    };

    const attachFile = () => {
        const attachToastId = "attach";
        toastInfo("All icons have the same functions, you can only upload images, gifs and videos!",attachToastId, "top-center");
        if(showAttachFile === false) {
            setShowAttachFile(true);
        } else {
            setShowAttachFile(false);
        }
        console.log("attachFile click", attachToastId);
    };

    const emoticons = () => {
        const emoticonToastId = "emoticon";
        toastInfo("Emoticons is not yet available!", emoticonToastId, "top-center");
    }

    const voiceMessage = () => {
        const voiceMessageToastId = "voiceMessage";
        toastInfo("Voice Message is not yet available!", voiceMessageToastId, "top-center");
    }

    const onFileChange = async (e) => {
        const fileSizeToastId = "fileSizeToastId";
        const file = e.target.files[0];
        if(file.size > 12 * 1024 * 1024){
            toastInfo("File should not exceed more than 12MB", fileSizeToastId, "top-center"); 
        }else{
            const storageRef = storage.ref();
            if(file.type.match('image.*')){
                const imagesRef = storageRef.child(`rooms/${roomName}/images`);
                const fileRef = imagesRef.child(file.name);
                await fileRef.put(file);
                setFileImageUrl(await fileRef.getDownloadURL());
                console.log("uploading image", fileImageUrl);
            }
            else if(file.type.match('video.*')){
                const videosRef = storageRef.child(`rooms/${roomName}/videos`);
                const fileRef = videosRef.child(file.name);
                await fileRef.put(file);
                setFileVideoUrl(await fileRef.getDownloadURL());
                console.log("uploading video", fileVideoUrl);
            }
            dispatch(setDrawerBottom(true));
        }
    };

    const handleClickAway = ()  => {
        setShowAttachFile(false);
    };

    return (
        <div className="chat__footer">
            <DrawerBottom 
                fileVideoUrl={fileVideoUrl}
                fileImageUrl={fileImageUrl}
                setFileImageUrl={setFileImageUrl}
                setFileVideoUrl={setFileVideoUrl}
                roomId={roomId} 
            /> 
            
            <TooltipCustom name="Emoticons" icon={<InsertEmoticonIcon />} onClick={() => emoticons()}/>
                <div>
                    <TooltipCustom 
                        name="Attach" 
                        icon={<AttachFileIcon/>} 
                        onClick={attachFile}
                    />
                    { showAttachFile? (
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <div className="chat__attachFile">
                                {attachFileLists.map((attachFileList) => 
                                <Slide direction="up" in={attachFile} mountOnEnter unmountOnExit>
                                    <Tooltip title={<span style={{fontSize: '14px', padding: '8px 5px 8px 5px'}}>
                                                        {attachFileList.title}
                                                    </span>} 
                                            placement="left">
                                        <Fab color="primary" aria-label="person">
                                            <div className="chat__icon">
                                                <label htmlFor="file-input">
                                                    {attachFileList.icon}
                                                </label>
                                                <input 
                                                    id="file-input"
                                                    type="file" 
                                                    onChange={onFileChange} 
                                                    accept="image/*,video/mp4,video/3gpp,video/quicktime"
                                                />
                                            </div>
                                        </Fab>
                                    </Tooltip>
                                </Slide>
                                )}
                            </div>
                        </ClickAwayListener>
                    ):null}
                </div>

                <form>
                    <input 
                        required 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        placeholder="Type a message" type="text" 
                    />
                    <button 
                        onClick={sendMessage} 
                        type="submit">
                        Send a message
                    </button>
                </form>
            <TooltipCustom name="Voice Message" icon={<MicIcon />} onClick={() => voiceMessage()}/>
        </div>
    )
}

export default ChatFooter
