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

// Image gallery
let techs = document.querySelectorAll(".technology-icon");
let gallery = document.querySelector("#gallery");
let galleryDisplay = gallery.querySelector("#gallery-display");
let leftArrow = document.querySelector("#arrow-left");
let rightArrow = document.querySelector("#arrow-right");
let closeButton = document.querySelector('#gallery-close-button');
let galleryImage = gallery.querySelector(".gallery-image")

let galleryTransition = 0.5;
let galleryTransitionms = galleryTransition * 1000;

galleryDisplay.style.transition = galleryTransition + "s"

let images = [
   ['Assets/apps_screenshots/fresh_pineapple1.jpg', 'Assets/apps_screenshots/fresh_pineapple2.jpg', 'Assets/apps_screenshots/fresh_pineapple3.jpg'],
   ['Assets/apps_screenshots/fresh_pineapple1.jpg', 'Assets/apps_screenshots/fresh_pineapple2.jpg', 'Assets/apps_screenshots/fresh_pineapple3.jpg'],
   ['Assets/apps_screenshots/vue_weather1.jpg', 'Assets/apps_screenshots/vue_weather2.jpg'],
   ['Assets/apps_screenshots/pokedex1.jpg', 'Assets/apps_screenshots/pokedex2.jpg'],
   ['Assets/apps_screenshots/mercato_continuo1.jpg', 'Assets/apps_screenshots/mercato_continuo2.jpg', 'Assets/apps_screenshots/mercato_continuo3.jpg'],
];
let technologyIndex = 0;
let imageIndex = 0;

let isGalleryOpen = false;

// Set gallery display area scale to 0 to show the animation
galleryDisplay.style.transform = "scale(0,0)";

// Remove transition delay on technologies icons when mouse is hover them
techs.forEach((el, i) => {
      el.addEventListener(
         "mouseenter",
         () => {
            el.style.transitionDelay = "0ms";
            el.style.zIndex = "3";
         }
      );

      // Open gallery
      el.addEventListener(
         "mousedown",
         () => {
            technologyIndex = i;
            imageIndex = 0;
            openGallery();
         }
      );
   }
);

// Close Gallery
closeButton.addEventListener(
   'mousedown',
   () => {
      closeGallery();
   }
);

document.addEventListener(
   'keydown',
   (e) => {
      if(e.key == 'Escape') closeGallery();
   }
)

// arrow click events
leftArrow.addEventListener(
   'mousedown',
   () => {
      imageIndex--;
      if(imageIndex < 0) imageIndex = images[technologyIndex].length-1;
      galleryImage.src=images[technologyIndex][imageIndex];
   }
);

rightArrow.addEventListener(
   'mousedown',
   () => {
      imageIndex++;
      if(imageIndex >= images[technologyIndex].length) imageIndex = 0;
      galleryImage.src=images[technologyIndex][imageIndex];
   }
);

function openGallery() {
   if(!isGalleryOpen) {
      gallery.style.display = 'flex';
      setTimeout(()=>{galleryDisplay.style.transform = "scale(1,1)";}, 10);
      
      galleryImage.src=images[technologyIndex][imageIndex];
      disableScrolling();
      isGalleryOpen = true;
   }
}

function closeGallery() {
   if(isGalleryOpen) {
      setTimeout(
         () => {
            gallery.style.display = 'none';
         },
         galleryTransitionms
      );
      galleryDisplay.style.transform = "scale(0,0)";
      enableScrolling();
      isGalleryOpen = false;
   }
}

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