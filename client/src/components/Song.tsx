import React from 'react';
import { useHistory } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ISong from '../models/ISong';
import { getDifficultyColor } from '../services/song.service';

interface SongProps {
    song: ISong;
}

const Song: React.FC<SongProps> = ({ song }: SongProps) => {

    const history = useHistory();

    return (
        <ListItem button onClick={ () => history.push(`/song/${song.id}`) } 
        style={{ 
            borderLeft: `solid 5px ${ getDifficultyColor(song.difficulty) }`,
            borderRadius: 3,
            background: '#2e333b',
            width: '95vw',
            maxWidth: 360,
            boxShadow: '5px 5px 2px 0px rgba(0,0,0,0.75)',
            color: 'white',
            height: 50
        }}>
            <p style={{ overflow: 'hidden', fontSize: 20 }} >{ song.name }</p>
        </ListItem>
    )
}

export default Song
