import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { getAudioLink, getAudioStatus, postAudio, deleteAudio } from '../services/audio.service';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    }
  }),
);

interface AudioProps {
    id: string;
    setIsDeleting: Function;
}

const Audio: React.FC<AudioProps> = ({ id, setIsDeleting }: AudioProps) => {

    const classes = useStyles();

    const [audioExists, setAudioExists] = useState<boolean>();
    const [audioFile, setAudioFile] = useState<File>();
    const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(true);
    const [isValidateModalOpen, setIsValidateModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const timer = React.useRef<number>();
    
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = async () => {
        try {
            let exists: boolean = await getAudioStatus(id);
            if (exists) { 
                setAudioExists(true);
            }
        }
        catch (ex) {
            setError(ex.message);
        } 
    }

    const handleAudioInput = (event: any) => {
        let audioFile: File = event.target.files[0];
        setAudioFile(audioFile);
        setIsUploadDisabled(false);
    }

    const handleUpload = async () => {
        try
        {
            setSuccess(false);
            setLoading(true);

            await postAudio(id, audioFile!);

            setSuccess(true);
            timer.current = window.setTimeout(() => {
                setAudioExists(true);
            }, 1000);
        }
        catch (ex)
        {
            setError(ex.message);
            setAudioFile(undefined);
            setIsUploadDisabled(true);
        }
        finally 
        {
            setLoading(false);
        }
    }

    const handleDeleteAudio = async () => {
        try {
            closeValidateModal();
            setIsDeleting(true);

            await deleteAudio(id);
            
            setAudioFile(undefined);
            setIsUploadDisabled(true);
            setSuccess(false);
            setAudioExists(false);
        }
        catch (ex) {
            setError(ex.message);
        }
        finally {
            setIsDeleting(false);
        }
    }

    const openValidateModal = () => {
        setIsValidateModalOpen(true);
    }

    const closeValidateModal = () => {
        setIsValidateModalOpen(false);
    }

    return (
        <div style={{ borderBottom: '1px solid white', borderTop: '1px solid white', padding: '20px 0' }}>
            { error && <div style={{ textAlign: 'center' }}><p style={{ color: 'white' }}>{ error }</p></div> }
            { audioExists ? 
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <audio controls style={{ outline: 'none' }}>
                    <source src={ getAudioLink(id) } type="audio/mp4" />
                </audio>
                <Fab color="secondary" aria-label="delete" onClick={ openValidateModal }>
                    <DeleteIcon />
                </Fab>
            </div>
            :
            <div style={{ 
                padding: '0px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <label htmlFor="upload-button">
                    <input id="upload-button" name="upload-button" style={{ display: 'none' }} type="file" accept="audio/*" onChange={ handleAudioInput } />
                    <Button className="btn-choose" color="primary" variant="contained" component="span">Choose Audio</Button>
                </label>
                <div className={classes.wrapper}>
                    <Fab
                        aria-label="save"
                        color="primary"
                        className={ buttonClassname }
                        onClick={ handleUpload }
                        disabled={ isUploadDisabled }
                    >
                        { success ? <CheckIcon /> : <ArrowUpwardIcon /> }
                    </Fab>
                    { loading && <CircularProgress size={68} className={classes.fabProgress} /> }
                </div>
            </div>
        }
         <Modal 
                open={ isValidateModalOpen }
                onClose={ closeValidateModal }
                className='validate-modal'
                closeAfterTransition
                BackdropComponent={ Backdrop }
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={ isValidateModalOpen }>
                    <div style={{
                        outline: 'none',
                        height: '100%',
                        color: 'white',
                        textAlign: 'center',
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <h2>Are sure you want to <b>DELETE</b> this Audio ?</h2>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around'
                        }}>
                            <Button color='secondary' onClick={ handleDeleteAudio }>DELETE</Button>
                            <Button color='primary' onClick={ closeValidateModal }>CANCEL</Button>
                        </div>
                    </div>
                </Fade>
            </Modal>   
        </div>
    )
}

export default Audio
