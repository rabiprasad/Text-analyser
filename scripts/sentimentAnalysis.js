import {API_KEY} from '../private.js';

export function sentimentAnalysis(text){   
    const data = "text="+text.replace(" ","%20")+"&language=english";
    // const data = "text=great%20movie&language=english";

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            displayResult(this.responseText);
        }
    });

    xhr.open("POST", "https://japerk-text-processing.p.rapidapi.com/sentiment/");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("x-rapidapi-key", `${API_KEY}`);
    xhr.setRequestHeader("x-rapidapi-host", "japerk-text-processing.p.rapidapi.com");
    xhr.send(data);

    document.querySelector('.sentiment-container').classList.add('show-container');
    
    /*Helper functions */
    function displayResult(responseData){
        const probability = JSON.parse(responseData).probability;
        const listItems = document.querySelectorAll('.sentiment-container ul span');
        listItems.forEach(listItem =>{
            listItem.textContent = ``;
        })

        listItems[0].textContent = Math.round(probability.pos * 100)+ '%' ;
        listItems[1].textContent = Math.round(probability.neutral * 100)+ '%';
        listItems[2].textContent = Math.round(probability.neg * 100)+ '%' ;

        listItems[0].parentElement.style.width = `${probability.pos * 100}%`;
        listItems[1].parentElement.style.width = `${probability.neutral * 100}%`;
        listItems[2].parentElement.style.width = `${probability.neg * 100}%`;

    }
}
