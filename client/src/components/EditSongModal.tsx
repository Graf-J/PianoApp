import React, { useState, useEffect } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import  { editSong, editYouTubeLink } from '../services/song.service';
import ISong from '../models/ISong';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

interface EditSongModalProps {
    song: ISong;
    songId: string;
    closeModal: Function;
    openSnackbar: Function
    updatePage: Function;
}

const EditSongModal: React.FC<EditSongModalProps> = ({ song, songId, closeModal, openSnackbar, updatePage }: EditSongModalProps) => {

    const [nameInputValue, setNameInputValue] = useState<string>('');
    const [linkInputValue, setLinkInputValue] = useState<string>('');
    const [sliderValue, setSliderValue] = useState<number>(10);
    const [isMaxNameInputLength, setIsMaxNameInputLength] = useState<boolean>(false);
    const [isNameInputEmpty, setIsNameInputEmpty] = useState<boolean>(false);
    const [isMaxLinkInputLength, setIsMaxLinkInputLength] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setNameInputValue(song.name);
        setSliderValue(song.difficulty);
        if (song.link) {
            setLinkInputValue(song.link);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSlider = (event: any, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };

    const handleNameInput = (event: any) => {

        setIsNameInputEmpty(false);

        if (nameInputValue.length < 50 || event.nativeEvent.inputType === 'deleteContentBackward') {
            setIsMaxNameInputLength(false);
            setNameInputValue(event.target.value);
        }
        else {
            setIsMaxNameInputLength(true);
        }
    }

    const handleLinkInput = (event: any) => {

        if (linkInputValue.length < 255 || event.nativeEvent.inputType === 'deleteContentBackward') {
            setIsMaxLinkInputLength(false);
            setLinkInputValue(event.target.value);
        }
        else {
            setIsMaxLinkInputLength(true);
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        
        if (nameInputValue.length === 0) {
            setIsNameInputEmpty(true);
        }
        else {
            setIsLoading(true);

            let song: ISong = {
                id: Number(songId),
                name: nameInputValue,
                difficulty: sliderValue,
                link: linkInputValue ? editYouTubeLink(linkInputValue) : ''
            }

            try {
                await editSong(song);
                updatePage(song);
                closeModal();
                openSnackbar();
            }
            catch (ex) {
                console.log(ex);
            }
            finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div style={{ 
            height: '100%', 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'space-between',
        }}>
            <form onSubmit={ handleSubmit }>
                <FormControl style={{
                    marginTop: '20px',
                    width: '90%',
                    marginLeft: '5%'
                }}>
                    <InputLabel style={{ color: 'white' }}>Song Name</InputLabel>
                    <BootstrapInput value={ nameInputValue } onChange={ handleNameInput } />
                    { isMaxNameInputLength && <p style={{ color: 'red', fontSize: 12 }}>Max Length reached</p> }
                    { isNameInputEmpty && <p style={{ color: 'red', fontSize: 12 }}>Input Box is Empty</p> }
                </FormControl>
                <FormControl style={{
                    marginTop: '20px',
                    width: '90%',
                    marginLeft: '5%'
                }}>
                    <InputLabel style={{ color: 'white' }}>Youtube Link</InputLabel>
                    <BootstrapInput value={ linkInputValue } onChange={ handleLinkInput } />
                    { isMaxLinkInputLength && <p style={{ color: 'red', fontSize: 12 }}>Max Length reached</p> }
                </FormControl>
                <div style={{
                    marginTop: '50px',
                    width: '90%',
                    marginLeft: '5%',
                }}>
                    <p style={{ 
                        color: 'white',
                        fontSize: '12px'
                    }}>Difficulty</p>
                    <Slider value={ sliderValue } onChange={ handleSlider } max={10} min={1} color='primary' valueLabelDisplay='on' />
                </div>
                <Button type='submit' style={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    width: '90%',
                    marginLeft: '5%',
                    marginTop: '50px',
                    letterSpacing: 10,
                    fontWeight: 'bold'
                }}>
                    EDIT
                </Button>
            </form>
            { isLoading && <LinearProgress color='primary' /> }
        </div>
    )
}

export default EditSongModal