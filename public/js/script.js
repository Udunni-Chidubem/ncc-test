let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}

$(document).ready(function(){

  var quantity=0;
     $('.quantity-right-plus').click(function(e){
          
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
          let input = $(this).closest('.input-group').find("#quantity")
          var quantity = parseInt(input.val())
          // var quantity = parseInt($(this).find('#quantity').val());
          
          // If is not undefined
              
              input.val(quantity + 1);
  
            
              // Increment
          
      });
  
       $('.quantity-left-minus').click(function(e){
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
          // var quantity = parseInt($(this).find('#quantity').val());
          let input = $(this).closest('.input-group').find("#quantity")
          var quantity = parseInt(input.val());
          
          // If is not undefined
        
              // Increment
              if(quantity>0){
                input.val(quantity - 1);
              }
      });
  
       $("input[type='radio']").click(function(){
  var sim = $("input[type='radio']:checked").val();
  //alert(sim);
  if (sim<3) { $('.myratings').css('color','red'); $(".myratings").text(sim); }else{ $('.myratings').css('color','green'); $(".myratings").text(sim); } });
      
  });
  
$(document).ready(function() {
  $('#activity-log-table').DataTable({
    "order": [[2, "desc"]]
  });
});

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bi-arrow-left-circle-fill");
let sidebarBtn2 = document.querySelector(".side-bi-arrow-left-circle-fill");
let sidebarBtn3 = document.querySelector(".bi-arrow-left-circle-fill");


sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("show");
  // sidebarBtn.classList.toggle("bi bi-arrow-right-circle-fill");
  sidebar.classList.add("sss");
  if(sidebarBtn3.classList.contains("bi-arrow-left-circle-fill")){
    sidebarBtn3.classList.remove("bi-arrow-left-circle-fill");
    sidebarBtn3.classList.add("bi-arrow-right-circle-fill");
  } else{
    sidebarBtn3.classList.add("bi-arrow-left-circle-fill");
    sidebarBtn3.classList.remove("bi-arrow-right-circle-fill");
  }
  
 
  
  // showSpan.classList.add('show');
});

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll('.sidebar .nav-link').forEach(function(element){
    
    element.addEventListener('click', function (e) {

      let nextEl = element.nextElementSibling;
      let parentEl  = element.parentElement;  

        if(nextEl) {
            e.preventDefault(); 
            let mycollapse = new bootstrap.Collapse(nextEl);
            
            if(nextEl.classList.contains('show')){
              mycollapse.hide();
            } else {
                mycollapse.show();
                // find other submenus with class=show
                var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                // if it exists, then close all of them
                if(opened_submenu){
                  new bootstrap.Collapse(opened_submenu);
                }
            }
        }
    }); // addEventListener
  }) // forEach
}); 
// DOMContentLoaded  end

/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}


/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener('change', showFileName() );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
}


/* PRODUCT INCREASE DECREASE BUTTON */


// let activeBtn = document.querySelector("activeB")
//   activeBtn.addEventListener("click", ()=> {
    
//   });

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

