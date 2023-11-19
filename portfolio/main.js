// Writing letter by letter
let phrase = '';
let letters = '';
let i = 0;
let dialog = document.getElementById('dialog')

const blur = document.getElementById('blur');
document.onmousemove = (evt) => {
   blur.style.transform = `translate(${evt.clientX}px, ${evt.clientY}px)`;
};

function writeLetters(ph) {

   phrase = ph;
   letters = '';
   i = 0;
   dialog.innerText = ''

   let interval = setInterval(() => {
      letters += phrase.charAt(i);
      dialog.innerText = letters;
      i++;

      if (i >= phrase.length) clearInterval(interval);

      console.log(phrase);
      //console.log(letters);
   }, 50)
}


function reset() {
   clearInterval(interval);
}