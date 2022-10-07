//Define some variables
const dictionary = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let stop = false; // When this variable is true, the function stops to try to find the hash

self.onmessage = (e) => {
    if(e.data == 'stop'){
        stop = true;
        return;
    }
    console.log('Starting with letter ' + e.data[1]);
    const hash = e.data[0];
    const letter = e.data[1];
    searchHash(hash, letter);
}

async function digestMessage(message) {
    const utf8 = new TextEncoder().encode(message);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    });
}

const searchHash = async (hash, letter) => {    
    let finded = false;
    const finalWord = letter + dictionary[dictionary.length - 1].repeat(4);
    let currentWord = letter + dictionary[0].repeat(4);

    while (!finded && !stop) {
        const hashWord = await digestMessage(currentWord)
        if (hashWord === hash) {
            self.postMessage(currentWord);
            finded = true;
        } 

        if (currentWord === finalWord) {
            break;
        }    
        currentWord = incrementString(currentWord);        
    }
}

const incrementString = (str) => {
    let lastChar = str.charAt(str.length - 1);
    if(lastChar === dictionary[dictionary.length - 1]) {
        if(str.length === 1) {
            return str;
        }
        return (incrementString(str.substring(0, str.length - 1)) + dictionary[0]);
    }
    const newStr = str.substring(0, str.length - 1) + dictionary[dictionary.indexOf(lastChar) + 1];
    return newStr;
}