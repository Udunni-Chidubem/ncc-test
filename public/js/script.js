let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
let sidebarBtn2 = document.querySelector(".side-bx-menu");
 
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("show");
  
  // showSpan.classList.add('show');
});

sidebarBtn2.addEventListener("click", ()=>{
  sidebar.classList.toggle("show");
  
  // showSpan.classList.add('show');
});

 
//  console.log(sidebarBtn2);
// sidebarBtn2.forEach(function(btn){

//   btn.addEventListener("click", function(e){
//   //  console.log(e.currentTarget);
//   e.currentTarget.classList.add('show');
//   });

// });


let activeBtn = document.querySelector("activeB")
activeBtn.addEventListener("click", ()=> {
  
});

function increaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('number').value = value;
}

function decreaseValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value < 1 ? value = 1 : '';
  value--;
  document.getElementById('number').value = value;
}