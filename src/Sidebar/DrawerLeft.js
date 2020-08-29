import React, { useEffect, useState } from 'react';
import { useStateValue } from '../StateProvider';
import { setDrawerLeft } from '../actions/drawerAction';
import { auth } from '../firebase';
import db from '../firebase';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';
import './DrawerLeft.css';

const useStyles = makeStyles ((theme) => ({
    root: {
        display: 'flex',
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        
        [theme.breakpoints.up('xs')]: {
            width: '100vw',
        },
        [theme.breakpoints.up('sm')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('md')]: {
            width: '30vw',
        },
        [theme.breakpoints.up('lg')]: {
            width: '30vw',
        },
    },
}));

function DrawerLeft() {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [showEditName, setShowEditName] = useState(false);
    const [showEditAbout, setShowEditAbout] = useState(false);
    const [{ user, drawerLeft },  dispatch] = useStateValue();

    const updateName = (e) => {
        e.preventDefault();
        
        auth.currentUser.updateProfile({
            displayName: name,
        });

        setShowEditName(false);
    };

    const updateAbout = (e) => {
        e.preventDefault();
         
        if(user.uid) {
            db.collection("users").doc(user.uid).set({
                about: about,
            })
        }
        setShowEditAbout(false);
    };

    const editName = () => {
        setShowEditName(true);
    };

    const editAbout = () => {
        setShowEditAbout(true);
    };

    const handleDrawerClose = () => {
        dispatch(setDrawerLeft(false));
        setShowEditName(false);
        setShowEditAbout(false);
    };

    useEffect(() => {
        if(user.uid) {
          db.collection("users")
            .doc(user.uid)
            .onSnapshot(snapshot => (
                setAbout(snapshot.data()?.about)
            ));
        }
       
    }, [user.uid]);


    return (
        <div>
            <Drawer
                anchor="left"
                variant="persistent"
                open={drawerLeft}
                classes={{ paper: classes.drawerPaper }}
                >
                    
                <div className="drawerLeft__header">
                    <div className="drawerLeft__header_container">
                        <IconButton onClick={handleDrawerClose}>
                            <ArrowBackIcon /> 
                        </IconButton>
                        <p>Profile</p>
                    </div>
                </div>
                
                <div className="drawerLeft__content">
                    <div className="drawerLeft__content_photo">
                        <Avatar src={user.photoURL} />
                    </div>

                    <div className="drawerLeft__content_name">
                        <p>Your Name</p>
                        { showEditName ? 
                            <form>
                                <input 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder={user.displayName} 
                                    type="text"
                                />
                                <CheckIcon onClick={updateName} /> 
                            </form>
                            :   
                            <form>
                                <input 
                                    value={user.displayName} 
                                    // onChange={e => setName(e.target.value)} 
                                    // placeholder={user.displayName} 
                                    // type="text" 
                                />
                                <EditIcon onClick={editName}/> 
                            </form>
                        }        
                    </div>

                    <div className="drawerLeft__note">
                        <span>
                            This is not your username or pin. This name will be visible to your WhatsApp contacts.
                        </span>
                    </div>

                    <div className="drawerLeft__content_name">
                        <p>About</p>
                        { showEditAbout ? 
                            <form>
                                <input 
                                    value={about} 
                                    onChange={e => setAbout(e.target.value)} 
                                    placeholder={about}
                                    type="text" 
                                />
                                <CheckIcon onClick={updateAbout} /> 
                            </form>
                            :   
                            <form>
                                <input 
                                    value={about} 
                                    // onChange={e => setAbout(e.target.value)} 
                                    // placeholder={about}
                                    // type="text" 
                                />
                                <EditIcon onClick={editAbout} />
                            </form>
                        } 
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default DrawerLeft