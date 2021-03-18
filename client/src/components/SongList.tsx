import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import ISong from '../models/ISong';
import { getSongs } from '../services/song.service';
import Song from './Song';
import AddSongModal from './AddSongModal';
import './SongList.css';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Songs: React.FC = () => {

    const [songs, setSongs] = useState<ISong[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

    useEffect(() => {
        setData();
    }, [])

    const setData = async () => {
        try 
        {
            let songs: ISong[] = await getSongs();
            setSongs(songs);
        }
        catch (ex) 
        {
            setError(ex.message);
        }
        finally 
        {
            setIsLoading(false);
        }
    }

    const updateList = (song: ISong) => {
        setSongs((prevSongs: ISong[]) => [song, ...prevSongs]);
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const openSnackbar = () => {
        setIsSnackbarOpen(true);
    }

    const closeSnackbar = () => {
        setIsSnackbarOpen(false);
    }

    const AddModal = React.forwardRef((props, ref) => <AddSongModal updateList={ updateList } closeModal={ closeModal } openSnackbar={ openSnackbar }/> );

    return (
        <div className='container'>
            { isLoading && 
            <div className='loader-wrapper'>
                <CircularProgress variant='indeterminate' size={100} thickness={1} />
            </div> }
            { error && <p style={{ color: 'white' }}>{ error }</p> }
            { songs && 
            <div className='content-wrapper'>
                <div className='create-button-wrapper'>
                    <Fab color="secondary" aria-label="add" onClick={ openModal } >
                        <AddIcon />
                    </Fab>
                </div>
                <List component='nav' aria-label="mailbox folders">
                    { songs.map((song: ISong) => (
                        <div key={ song.id } className='song'>
                            <Song song={ song }/>
                        </div>
                    ))}
                </List>
                <Modal 
                    open={ isModalOpen }
                    onClose={ closeModal }
                    className='create-song-modal'
                    closeAfterTransition
                    BackdropComponent={ Backdrop }
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={ isModalOpen }>
                        <AddModal />
                    </Fade>
                </Modal>
                <Snackbar open={ isSnackbarOpen } anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}} autoHideDuration={ 3000 } onClose={ closeSnackbar }>
                    <Alert onClose={ closeSnackbar } severity="success">
                        Added Song
                    </Alert>
                </Snackbar>
            </div>}
        </div>
    )
}

export default Songs
