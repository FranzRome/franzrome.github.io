// Prevent images to be dragged around
let notDraggable = document.querySelectorAll('img,a');

for (let e of notDraggable) {
   e.setAttribute('draggable', 'false');
}

// Detect when an object is shown and play the transition
const observer = new IntersectionObserver((entries) => {
   entries.forEach((entry) => {
      //console.log(entry);
      if (entry.isIntersecting) {
         entry.target.classList.add('show');
      }
   });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Modal Functions
function disableScrolling() {
   document.documentElement.setAttribute('class', 'no-scroll');
}
function enableScrolling() {
   document.documentElement.setAttribute('class', '');
}

function openModal() {
   document.getElementById('modal-avatar').style.display = 'flex';
   disableScrolling();
}

function closeModal() {
   document.getElementById('modal-avatar').style.display = 'none';
   enableScrolling();
}