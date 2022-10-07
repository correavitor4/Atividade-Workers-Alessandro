//Define some variables
const dictionary = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


self.onmessage = (e) => {
    console.log('Message received from main script');
    const hash = e.data[0];
    const letter = e.data[1];
    searchHash(hash, letter);
}

async function digestMessage(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hash;
}

const searchHash = async (hash, letter) => {
    let finded = false;
    const finalWord = letter + letter + letter + letter + letter
    let currentWord = letter;
    //If is the first time
    digestMessage(currentWord).then((hashWord) => {
        if (hashWord === hash) {
            self.postMessage(currentWord);
            finded = true;
        }
    });

    while (!finded ) {
        currentWord = incrementString(currentWord);
        digestMessage(currentWord).then((hashWord) => {
            if (hashWord === hash) {
                self.postMessage(currentWord);
                finded = true;
            }
        });

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
            return dictionary[0] + dictionary[0];
        }
        return (incrementString(str.substring(0, str.length - 1)) + dictionary[0]);
    }
    const newStr = str.substring(0, str.length - 1) + dictionary[dictionary.indexOf(lastChar) + 1];
    return newStr;
}