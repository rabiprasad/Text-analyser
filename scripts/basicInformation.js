export function basicInformation(text){
    
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
