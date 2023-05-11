let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}

let x = 0;
let original = document.getElementById('duplicater');


function duplicate() {
  let clone = original.cloneNode(true);
  clone.id = "duplicater" + ++x;
  original.after(clone);
}

function deleteDuplicate() {
  let original = document.getElementById('duplicater' + x);
  let clone = original.cloneNode(true);
  original.remove(clone);

 }

// function deleteItem() {
//   console.log(clicked)
// }
// deleteDuplicate.addEventListener('click', function(){
//   this.parentElement('.duplicater').remove()
// } )

$(document).ready(function(){

  var quantity=0;
     $('.quantity-right-plus').click(function(e){
          
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
        let btnMinus=$(this).closest('.product-price').find('.quantity-left-minus')
        let btnPlus=$(this).closest('.product-price').find('.quantity-right-plus')
          let input = $(this).closest('.input-group').find("#quantity")
          var quantity = parseInt(input.val())
          let max = input.attr("max")
          // var quantity = parseInt($(this).find('#quantity').val());
          
          // If is not undefined
              if(quantity<max){
                input.val(quantity + 1);
                btnMinus.removeAttr("disabled")
                quantity=quantity+1
              }

              if(quantity==max)
                btnPlus.attr("disabled", true)
              
  
            
              // Increment
          
      });
  
       $('.quantity-left-minus').click(function(e){
          // Stop acting like a button
          e.preventDefault();
          // Get the field name
          // var quantity = parseInt($(this).find('#quantity').val());
          let btnMinus=$(this).closest('.product-price').find('.quantity-left-minus')
          let btnPlus=$(this).closest('.product-price').find('.quantity-right-plus')

          let input = $(this).closest('.input-group').find("#quantity")
          var quantity = parseInt(input.val());
          let min = input.attr("min")
          // If is not undefined
        
              // Increment
              if(quantity>min){
                input.val(quantity - 1);
                btnPlus.removeAttr("disabled")
                quantity=quantity-1
              }
              if(quantity==min)
                btnMinus.attr("disabled", true)
      });
  
       $("input[type='radio']").click(function(){
  var sim = $("input[type='radio']:checked").val();
  //alert(sim);
  if (sim<3) { $('.myratings').css('color','red'); $(".myratings").text(sim); }else{ $('.myratings').css('color','green'); $(".myratings").text(sim); } });
     
  $("#uploadImage").click(function(e) {
  $("#file").click();
});

  });
  
$(document).ready(function CopyToClipboard(containerid) {
  if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(containerid));
      range.select().createTextRange();
      document.execCommand("copy");
  } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(document.getElementById(containerid));
      window.getSelection().addRange(range);
      document.execCommand("copy");
      alert("Code has been copied.")
  }
});

$(document).ready(function() {
  $('#activity-log-table').DataTable({
    "order": [[2, "desc"]]
  });
});
$(document).ready(function() {
  $('#offlineSales').DataTable({
    // "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#farmers-table').DataTable({
    // "order": [[1, "asc"]]
  });
});
$(document).ready(function() {
  $('#seed-trader-table').DataTable({
    // "order": [[1, "asc"]]
  });
});
$(document).ready(function() {
  $('#seed-company-table').DataTable({
    // "order": [[1, "asc"]]
  });
});

$(document).ready(function() {
  $('#transactionTable').DataTable({
    "aLengthMenu": [ 10, 25, 50, 100 ],
    "order": [[]
  });
});
$(document).ready(function() {
  $('#referesTable').DataTable({
    "aLengthMenu": [ 10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#in_flow_Table').DataTable({
    "aLengthMenu": [ 5, 10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#all-orders-table').DataTable({
    "aLengthMenu": [10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#active-orders-table').DataTable({
    "aLengthMenu": [10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#shipped-table').DataTable({
    "aLengthMenu": [ 10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#fulfilled-table').DataTable({
    "aLengthMenu": [ 5, 10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function() {
  $('#draft-table').DataTable({
    "aLengthMenu": [ 5, 10, 25, 50, 100 ],
    "order": [[1, "desc"]]
  });
});

$(document).ready(function(){
    $(".view-btn").click(function(){
        $(this).text($(this).text() == 'Show Ledger' ? 'Hide Ledger' : 'Show Ledger');
        if ($(this).text() === 'Show Ledger') {
          $("#Myid").hide(300);
        }
        else
          $("#Myid").show(300);
    });
});


$(document).ready(function() {
  $('#all-sheet-table').DataTable({
    "aLengthMenu": [5, 10, 25, 50, 100 ],
    "orders": [[1, "asc"]]
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

/*  ==========================================
    TRANSLATE
* ========================================== */

function googleTranslateElementInit() {
  new google.translate.TranslateElement({includedLanguages:'ig,en,ha,yo', pageLanguage: 'en',  layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL}, 'google_translate_element');
}





/*  ==========================================
    TIMER FOR OTP
* ========================================== */

