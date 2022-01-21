const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);


//modal
// Get the modal
var modal = document.getElementById("myModal");
var modal1 = document.getElementById("myModal1");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var btn1 = document.getElementById("myBtn1");
// console.log(btn)

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
var span = document.getElementById("close");
var span1 = document.getElementById("close1");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks the button, open the modal 1
if(btn1){
  btn1.onclick = function() {
    modal1.style.display = "block";
  }
}
// When the user clicks on <span> (x), close the modal 1 
if(span1){
  span1.onclick = function() {
    modal1.style.display = "none";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  else if (event.target == modal1) {
    modal1.style.display = "none";
  }
}

if(document.getElementById("leaveTime")){
  document.getElementById("leaveTime").addEventListener("change", () => {
    document.getElementById("timeConvert").innerHTML = document.getElementById("leaveTime").value/8;
  });
}