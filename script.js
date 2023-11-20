// Menu button interaction (Works only using Jquery)
/*
$(document).ready(function(){
    // Open menu panel
    $(".menu-button").on('click', function(){
        $(".menu-panel").toggleClass("menu-panel--open");
        $(".bar1").toggleClass("bar1--open");
        $(".bar2").toggleClass("bar2--open");
        $(".bar3").toggleClass("bar3--open");
    });

});
*/

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