import {API_KEY} from '../private.js';

export function spellingCheck(text){
    const body = {
		"language": "enUS",
		"fieldvalues": `${text}`,
		"config": {
			"forceUpperCase": false,
			"ignoreIrregularCaps": false,
			"ignoreFirstCaps": false,
			"ignoreNumbers": true,
			"ignoreUpper": false,
			"ignoreDouble": false,
			"ignoreWordsWithNumbers": true,
            "ignoreWordsWithPunctuation": false
		}
	}

    const getData = async () => {
        const response = await fetch("https://jspell-checker.p.rapidapi.com/check", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "x-rapidapi-key": `${API_KEY}`,
                "x-rapidapi-host": "jspell-checker.p.rapidapi.com"
            },
            "body": JSON.stringify(body)
        });
        const data = response.json();
        return data;
    }
    
    getData()
    .then(data => {
        document.querySelector('.spelling-container p span').textContent = data.spellingErrorCount;

        if(data.spellingErrorCount > 0){
        const responseData = getErrorSuggestions(data);
        const  errorWords = responseData[0];
        const  suggestions = responseData[1];
        const positions = responseData[2];
        displayResult(text,errorWords,suggestions,positions);
        }
        else{
            document.querySelector('.spelling-container #incorrect-text').textContent = text;
            document.querySelector('.spelling-container #correct-text').textContent = text;
        }

    })
    .catch(err =>{
        console.log("Error: ",err);
    });
    
    const mainContainer = document.querySelector('.spelling-container');
    mainContainer.classList.add('show-container');
    
    /* helper function */
    function getErrorSuggestions(data){    //returns array of error words and suggestions
        const error = [];
        const suggestions = [];
        const positions =[];
        let temp = data.elements[0].errors;
        temp.forEach(e => {
            positions.push(e.position);
            error.push(e.word);
            suggestions.push(e.suggestions[0]);
        });
        return [error,suggestions,positions];
    }

    function displayResult(text,errorWords,suggestions,positions){
        let tempError = ``;
        let tempCorrect = ``;
        let pointer = 0;
        for(let i=0; i<errorWords.length; i++){

            tempError = tempError + text.substr(pointer,positions[i]-pointer);
            tempError = tempError + `<span class="incorrect-word">${text.substr(positions[i],errorWords[i].length)}</span>`
            tempCorrect = tempCorrect + text.substr(pointer,positions[i]-pointer);
            tempCorrect = tempCorrect + `<span class="correct-word">${suggestions[i]}</span>`
            pointer=positions[i]+errorWords[i].length;
        }

        tempError = tempError + text.substr(pointer);
        tempCorrect = tempCorrect + text.substr(pointer);
        document.querySelector('.spelling-container #incorrect-text').innerHTML = tempError;
        document.querySelector('.spelling-container #correct-text').innerHTML = tempCorrect;
    }
}
