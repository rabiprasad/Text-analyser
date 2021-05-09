import {API_KEY} from '../private.js';

export function getSummary(text){
    
    document.querySelector('#summary-field ul').innerHTML = ``;
    const getData = async (text) => {
        const url = "https://aylien-text.p.rapidapi.com/summarize?text=" + text.replaceAll(" ","%20").replaceAll("?","%3F")+"&title=summary";
        
        const response = await fetch(`${url}`, 
        {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": `${API_KEY}`,
                "x-rapidapi-host": "aylien-text.p.rapidapi.com"
            }
        });
        return response.json()
    }

    getData(text)
    .then(data =>{
        let counter = 1;
        const ul = document.querySelector('.summary-container ul');
        data.sentences.forEach(sentence =>{
            let li = document.createElement('li');
            li.textContent = sentence;
            ul.append(li);
        })
    })
    .catch(err =>{
        console.log(err);
    })

    document.querySelector('.summary-container').classList.add('show-container');

}
