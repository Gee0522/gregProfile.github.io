// side bar navigation
$(document).ready(function () {
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $("header").toggleClass("toggle");
  });

  $(window).on("scroll load", function () {
    $("#menu").removeClass("fa-times");
    $("header").removeClass("toggle");

    if ($(window).scrollTop() > 0) {
      $(".top").show();
    } else {
      $(".top").hide();
    }
  });

  // smooth scrolling

  $('a[href*="#"]').on("click", function (e) {
    e.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $($(this).attr("href")).offset().top,
      },
      300,
      "linear"
    );
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   // Get the modal image element
//   var modalImageContent = document.getElementsByClassName(
//     "modal-content-image"
//   );

//   // Get the header element
//   var header = document.getElementById("header");

//   // Add a click event listener to the modal image
//   modalImageContent.addEventListener("click", function () {
//     header.classList.toggle("overlay-header");
//   });
// });

// function for image modal
function setupImageModal(imgId, modalId, modalImgId, captionId, closeId) {
  var modalImage = document.getElementById(modalId);
  var img = document.getElementById(imgId);
  var modalImg = document.getElementById(modalImgId);
  var captionText = document.getElementById(captionId);

  img.onclick = function () {
    modalImage.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };

  var spanImage = document.getElementById(closeId);

  spanImage.onclick = function () {
    modalImage.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modalImage) {
      modalImage.style.display = "none";
    }
  };
}

// // Usage for image1
setupImageModal("myImg", "imageModal", "img01", "caption", "closeImage");

// // Usage for image2
setupImageModal("myImg2", "imageModal2", "img02", "caption2", "closeImage2");

// Usage for image3
setupImageModal("myImg3", "imageModal3", "img03", "caption3", "closeImage3");

// Usage for image4
setupImageModal("myImg4", "imageModal4", "img04", "caption4", "closeImage4");

// type writing effects
var i = 0;
var txt = "I'm Greg Espellogo";
var speed = 180;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("text").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    i = 0;
    document.getElementById("text").innerHTML = "";
    setTimeout(typeWriter, speed);
  }
}
// Call the typeWriter function when the document is ready
document.addEventListener("DOMContentLoaded", function () {
  typeWriter();
});
