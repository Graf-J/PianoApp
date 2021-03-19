import axios from 'axios';
import ISong from '../models/ISong';

const SERVER_URL = `http://${window.location.hostname}:8000`;

const getSongs = (): Promise<ISong[]> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            let response = await axios.get<ISong[]>(`${SERVER_URL}/Songs`);
            let songs: ISong[] = response.data;
            resolve(songs);
        }
        catch (ex)
        {
            reject(ex);
        } 
    })
}

const getSong = (id: string): Promise<ISong> => {
    return new Promise(async (resolve, reject) => {
        try
        {
            let response = await axios.get<ISong>(`${SERVER_URL}/Song/${id}`)
            let song: ISong = response.data;
            resolve(song);
        }
        catch (ex) 
        {
            reject(ex);
        }
    })
}

const postSong = (song: ISong): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            let response = await axios.post(`${SERVER_URL}/Song`, song);
            let songId: number = response.data.id;
            resolve(songId);
        }
        catch (ex)
        {
            reject(ex);
        }
    })
}

const editSong = (song: ISong): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            await axios.put(`${SERVER_URL}/Song`, song);
            resolve('OK')
        }
        catch (ex)
        {
            reject(ex);
        }
    })
}

const deleteSong = (id: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            await axios.delete(`${SERVER_URL}/Song/${id}`);
            resolve('OK');
        }
        catch (ex)
        {
            reject(ex);
        }
    })
}

const editYouTubeLink = (link: string): string => {
    let splittedLink: string[] = link.split('/');
    let youtubeId = splittedLink[splittedLink.length - 1]
    let youtubeEmbededLink = `https://www.youtube.com/embed/${youtubeId}`;
    console.log(youtubeEmbededLink);
    return youtubeEmbededLink;
}

const getDifficultyColor = (difficulty: number): string => {
    switch (difficulty) {
        case 1:
            return '#30e369';
        case 2:
            return '#c2e330';
        case 3:
            return '#f7f020';
        case 4:
            return '#30e3d1';
        case 5:
            return '#30aae3';
        case 6:
            return '#305de3';
        case 7:
            return '#6630e3';
        case 8:
            return '#da30e3';
        case 9:
            return '#e3308c';
        case 10:
            return '#e33030';
        default:
            return '#000000';
    }
}
 

export {
    getSongs,
    getSong,
    postSong,
    editSong,
    deleteSong,
    editYouTubeLink,
    getDifficultyColor
}