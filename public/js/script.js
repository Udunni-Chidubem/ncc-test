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


console.log(sidebarBtn);
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

$(document).ready(function(){

var quantitiy=0;
   $('.quantity-right-plus').click(function(e){
        
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#quantity').val());
        
        // If is not undefined
            
            $('#quantity').val(quantity + 1);

          
            // Increment
        
    });

     $('.quantity-left-minus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#quantity').val());
        
        // If is not undefined
      
            // Increment
            if(quantity>0){
            $('#quantity').val(quantity - 1);
            }
    });

     $("input[type='radio']").click(function(){
var sim = $("input[type='radio']:checked").val();
//alert(sim);
if (sim<3) { $('.myratings').css('color','red'); $(".myratings").text(sim); }else{ $('.myratings').css('color','green'); $(".myratings").text(sim); } });
    
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

