import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Audio from './Audio';
import EditSongModal from './EditSongModal';
import { useHistory } from 'react-router-dom';
import { getSong, deleteSong, getDifficultyColor } from '../services/song.service';
import ISong from '../models/ISong';
import './SongInfo.css';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface RouteParams { 
    id: string 
}

const SongInfo = ({ match }: RouteComponentProps<RouteParams>) => {
    
    const history = useHistory();

    const [song, setSong] = useState<ISong>();
    const [songLink, setSongLink] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isValidateModalOpen, setIsValidateModalOpen] = useState<boolean>(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            try 
            {
                let songId: string = match.params.id;

                let song: ISong = await getSong(songId);
                setSong(song);

                if (song.link) {
                    setSongLink(song.link);
                }
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

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    

    const handleDeleteSong = async () => {
        try {
            closeValidateModal();
            setIsDeleting(true);
            await deleteSong(match.params.id);
            history.push(`/`);
        }
        catch (ex) {
            setError(ex.message);
        }
        finally {
            setIsDeleting(false);
        }
    }

    const updatePage = (song: ISong) => {
        setSong(song);
        setSongLink(song.link!);
    }

    const openEditModal = () => {
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    }

    const openValidateModal = () => {
        setIsValidateModalOpen(true);
    }

    const closeValidateModal = () => {
        setIsValidateModalOpen(false);
    }

    const openSnackbar = () => {
        setIsSnackbarOpen(true);
    }

    const closeSnackbar = () => {
        setIsSnackbarOpen(false);
    }

    const EditModal = React.forwardRef((props, ref) => <EditSongModal song={ song! } songId={ match.params.id } closeModal={ closeEditModal } openSnackbar={ openSnackbar } updatePage={ updatePage } /> );

    return (
    <div className='song-info-container'>
            { isLoading && 
            <div className='loader-wrapper'>
                <CircularProgress variant='indeterminate' size={100} thickness={1} />
            </div> }
            { error && <div style={{ textAlign: 'center' }}><p style={{ color: 'white' }}>{ error }</p></div> }
            { song &&
                <div style={{ borderTop: `3px solid ${getDifficultyColor(song.difficulty)}` }}>
                    { isDeleting && <LinearProgress color='secondary' /> }
                    <IconButton aria-label="delete" onClick={ () => history.push(`/`) } style={{ marginTop: '10px', marginLeft: '10px' }}>
                        <ArrowBackIosIcon fontSize="large" color="secondary" />
                    </IconButton>
                    <div className='name-wrapper'>
                        <h2>{ song.name }</h2>
                    </div> 
                </div> 
            }
            { songLink && <iframe width="100%" height="35%" title="Youtube Video" src={ songLink } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ marginBottom: 20 }} /> }
            <Audio id={ match.params.id } setIsDeleting={ setIsDeleting } />
            <div className='edit-button-wrapper'>
                <Fab color="primary" aria-label="add" onClick={ openEditModal } >
                    <EditIcon />
                </Fab>
            </div>
            <div className='delete-button-wrapper'>
                <Fab color="secondary" aria-label="add" onClick={ openValidateModal } >
                    <DeleteIcon />
                </Fab>
            </div>
            <Modal 
                open={ isEditModalOpen }
                onClose={ closeEditModal }
                className='edit-song-modal'
                closeAfterTransition
                BackdropComponent={ Backdrop }
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={ isEditModalOpen }>
                    <EditModal />
                </Fade>
            </Modal>
            <Modal 
                open={ isValidateModalOpen }
                onClose={ closeValidateModal }
                className='validate-modal'
                closeAfterTransition
                BackdropComponent={ Backdrop }
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={ isValidateModalOpen }>
                    <div className='validate-modal-content-wrapper'>
                        <h2>Are sure you want to <b>DELETE</b> this Song ?</h2>
                        <div className='validate-modal-button-wrapper'>
                            <Button color='secondary' onClick={ handleDeleteSong }>DELETE</Button>
                            <Button color='primary' onClick={ closeValidateModal }>CANCEL</Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <Snackbar open={ isSnackbarOpen } anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}} autoHideDuration={ 3000 } onClose={ closeSnackbar }>
                <Alert onClose={ closeSnackbar } severity="success">
                    Edited Song
                </Alert>
            </Snackbar>
        </div>
    )
}

export default SongInfo
