import React, { useState } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import  { postSong } from '../services/song.service';
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

interface AddSongModalProps {
    updateList: Function;
    closeModal: Function;
    openSnackbar: Function;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ updateList, closeModal, openSnackbar }: AddSongModalProps) => {

    const [inputValue, setInputValue] = useState<string>('');
    const [sliderValue, setSliderValue] = useState<number>(10);
    const [isMaxInputLength, setIsMaxInputLength] = useState<boolean>(false);
    const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSlider = (event: any, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };

    const handleInput = (event: any) => {

        setIsInputEmpty(false);

        if (inputValue.length < 50 || event.nativeEvent.inputType === 'deleteContentBackward') {
            setIsMaxInputLength(false);
            setInputValue(event.target.value);
        }
        else {
            setIsMaxInputLength(true);
        }
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        
        if (inputValue.length === 0) {
            setIsInputEmpty(true);
        }
        else {
            setIsLoading(true);

            try {

                let song: ISong = {
                    name: inputValue,
                    difficulty: sliderValue
                }

                let songId: number = await postSong(song);
                song.id = songId;

                updateList(song);
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
                    <BootstrapInput value={ inputValue } onChange={ handleInput } />
                    { isMaxInputLength && <p style={{ color: 'red', fontSize: 12 }}>Max Length reached</p> }
                    { isInputEmpty && <p style={{ color: 'red', fontSize: 12 }}>Input Box is Empty</p> }
                </FormControl>
                <div style={{
                    marginTop: '50px',
                    width: '90%',
                    marginLeft: '5%',
                }}>
                    <p style={{ 
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'sans-serif'
                    }}>Difficulty</p>
                    <Slider value={sliderValue} onChange={ handleSlider } max={10} min={1} color='secondary' valueLabelDisplay='on' />
                </div>
                <Button type='submit' style={{
                    background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
                    width: '90%',
                    marginLeft: '5%',
                    marginTop: '50px',
                    letterSpacing: 10,
                    fontWeight: 'bold'
                }}>
                    CREATE
                </Button>
            </form>
            { isLoading && <LinearProgress color='secondary' /> }
        </div>
    )
}

export default AddSongModal
