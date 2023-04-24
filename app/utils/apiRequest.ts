import axios, { AxiosRequestConfig } from 'axios';

interface Options extends AxiosRequestConfig {
    params: {
        url: string;
    };
    headers: {
        'content-type': string;
        'X-RapidAPI-Key': string;
        'X-RapidAPI-Host': string;
    };
}

const options: Options = {
    method: 'GET',
    url: 'https://instagram-reels-downloader2.p.rapidapi.com/.netlify/functions/api/getLink',
    headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': '33cd218893msh0d2995188d84c7dp15fcbcjsnecb3cf52a0ec',
        'X-RapidAPI-Host': 'instagram-reels-downloader2.p.rapidapi.com',
    },
    params: {
        url: '',
    },
};

export async function getDownloadLink(url: string): Promise<string | null> {
    options.params.url = url;
    try {
        const response = await axios.request(options);
        return response?.data?.url_list[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}
