let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bi-arrow-left-circle-fill");
let sidebarBtn2 = document.querySelector(".side-bi-arrow-left-circle-fill");
let sidebarBtn3 = document.querySelector(".bi-arrow-left-circle-fill");

<<<<<<< HEAD
=======

console.log(sidebarBtn);
>>>>>>> f432b0ca50557b7c5d35512997a6e12ed4b9d17b
sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("show");
  // sidebarBtn.classList.toggle("bi bi-arrow-right-circle-fill");
  sidebar.classList.add("sss");
  if(sidebarBtn3.classList.contains("bi-arrow-left-circle-fill")){
    sidebarBtn3.classList.remove("bi-arrow-left-circle-fill");
  sidebarBtn3.classList.add("bi-arrow-right-circle-fill");
  }

  else{
    sidebarBtn3.classList.add("bi-arrow-left-circle-fill");
  sidebarBtn3.classList.remove("bi-arrow-right-circle-fill");
  }
  
 
  
  // showSpan.classList.add('show');
});

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