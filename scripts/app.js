import {basicInformation} from './basicInformation.js';
import {sentimentAnalysis} from './sentimentAnalysis.js';
import {spellingCheck} from './spellingCheck.js';
import {getSummary} from './getSummary.js';

const textContainerForm = document.querySelector('.text-container'); //form
const textarea = document.querySelector('#text-area');

textContainerForm.addEventListener('submit',(e)=>{
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

/**** Helper functions*****/ 
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
