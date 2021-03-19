import axios from 'axios';

const SERVER_URL = 'http://server:8000';

const getAudioStatus = (id: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            let response = await axios.get(`${SERVER_URL}/Audio/${id}/Exists`);
            let exists: boolean = response.data.status;
            resolve(exists);
        }
        catch (ex)
        {
            reject(ex);
        } 
    })
}

const getAudioLink = (id: string): string => {
    return `${SERVER_URL}/Audio/${id}`;
}

const postAudio = (id: string, audioFile: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            const formData: FormData = new FormData();
            formData.append('file', audioFile, audioFile.name);
            await axios.post(`${SERVER_URL}/Audio/${id}`, formData)
            resolve('OK')
        }
        catch (ex) 
        {
            reject(ex);
        }
    })
}

const deleteAudio = (id: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try 
        {
            await axios.delete(`${SERVER_URL}/Audio/${id}`);
            resolve('OK');
        }
        catch (ex)
        {
            reject(ex);
        }
    })
}

export {
    getAudioStatus,
    getAudioLink,
    postAudio,
    deleteAudio
}