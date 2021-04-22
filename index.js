/*
const apiKey = YOUR RAPIDAPI API_KEY HERE;
APIs used JSpell Checker, Text-Processing, Text Analysis
*/

const submitBtn = document.querySelector('.submit-btn');
const textarea = document.querySelector('#text-area');
const display = document.querySelector('.text-input p');


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    startOperation(); //hides unwanted result section
    let checkboxes = document.querySelectorAll('.operations input[type="checkbox"]:checked');
    const  text = textarea.value;
    const ModifiedText = modify(text);

    if(text.length === 0){
        textarea.placeholder = "Enter valid Text";
        alert("Enter valid text :(");
        return;
    }
    if(checkboxes.length === 0){
        alert("Choose at least one operation");
    }
  

    checkboxes = Array.from(checkboxes).map(item=>{
        return item.id;
    });
    checkboxes.forEach(c=>{
        if(c === 'basic-analyses'){basicInformation(ModifiedText);}
        if(c === 'sentiment-analyses'){sentimentAnalysis(ModifiedText);}
        if(c === 'spelling-check'){spellingCheck(text);}
        if(c === 'get-summary'){getSummary(ModifiedText);}

    })
    
    setTimeout(()=>{endOperations(checkboxes);},1000);
    
});

/****functions*****/ 
function startOperation(){
    const sections = document.querySelector('.results').children;
    Array.from(sections).forEach(section => {
        section.classList.remove('show-container');
    })
}

function endOperations(checkboxes){
    document.querySelector('.results').classList.add('show-container');
    const element = document.querySelector('.results').scrollIntoView();
    checkboxes.forEach(checkbox=>{
        document.getElementById(`${checkbox}`).checked = false;
    })
    
}

function modify(text){
    text = text.replace(/(^\s*)|(\s*$)/g,"");
    text = text.replace(/[ ]{2,}/g," ");
    text = text.replace(/\n /g,"\n");
    return text;
}

function basicInformation(text){
    
    let characterCount = text.length;
    let vowelAndConsonant = 0;
    let vowels = 0;
    let consonants =0;
    let spaceCount = 0;
    let sentenceArray = text.match(/\w+(\.|\?) /g);
    let sentenceCount = sentenceArray !== null ? sentenceArray.length+1 : 1;
    let punctuationCount = characterCount - vowels - consonants - spaceCount;

    for(let i=0; i<text.length; i++){
        let char = text.charAt(i);

        if(char===" "){spaceCount++;}
        if(char.match(/[A-Za-z]/)){vowelAndConsonant++;}
        if("aeiouAEIOU".includes(char)){vowels++;}
    }
    
    const element = document.querySelector('.basic-info-container ul');
    element.innerHTML = `<li>Characters: ${characterCount}</li>
                        <li>vowels: ${vowels}</li>
                        <li>consonants: ${vowelAndConsonant-vowels}</li>
                        <li>Spaces: ${spaceCount}</li>
                        <li>punctuations: ${characterCount -vowelAndConsonant - spaceCount}</li>
                        <li>words: ${spaceCount+1}</li>
                        <li>Sentences: ${sentenceCount}</li>
                        <li>Characters/word: ${(characterCount/(spaceCount+1)).toFixed(1)}</li>
                        <li>words/sentence: ${((spaceCount+1)/sentenceCount).toFixed(1)}</li>`;

    const mainContainer = document.querySelector('.basic-info-container');
    mainContainer.classList.add('show-container');
}

function spellingCheck(text){
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
                "x-rapidapi-key": `${apiKey}`,
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
        const textArray = text.split(" ");
        displayResult(textArray,errorWords,suggestions);
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
        console.log(data);
        let temp = data.elements[0].errors;
        temp.forEach(e => {
            error.push(e.word);
            suggestions.push(e.suggestions[0]);
        });
        return [error,suggestions];
    }

    function displayResult(textArray,errorWords,suggestions){
        let tempError = [];
        let tempCorrect = [];
        textArray.forEach(e => {
            const index = errorWords.indexOf(e);
            if(index !== -1){
                tempError.push(`<span class="incorrect-word">${errorWords[index]}</span>`);
                tempCorrect.push(`<span class="correct-word">${suggestions[index]}</span>`);

            }
            else{
                tempError.push(e);
                tempCorrect.push(e);
            }
        });
        tempError = tempError.join(" ");
        tempCorrect = tempCorrect.join(" ");
        document.querySelector('.spelling-container #incorrect-text').innerHTML = tempError;
        document.querySelector('.spelling-container #correct-text').innerHTML = tempCorrect;
    }
}

function sentimentAnalysis(text){   
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
    xhr.setRequestHeader("x-rapidapi-key", `${apiKey}`);
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

function getSummary(text){
    
    
    document.querySelector('#summary-field ul').innerHTML = ``;
    const getData = async (text) => {
        const url = "https://aylien-text.p.rapidapi.com/summarize?text=" + text.replaceAll(" ","%20").replaceAll("?","%3F")+"&title=summary";
        
        const response = await fetch(`${url}`, 
        {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": `${apiKey}`,
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
