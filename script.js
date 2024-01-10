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

// collapsible
var coll = document.getElementsByClassName("collapsible");
var con = document.getElementById("content");

for (var i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var con = this.nextElementSibling;
    if (con.style.display === "block") {
      con.style.display = "none";
    } else {
      con.style.display = "block";
    }
  });
}
// Close collapsible content when clicking outside
document.addEventListener("click", function (event) {
  var isCollapsibleContent = event.target.matches(
    ".collapsible, .collapsible *"
  );
  if (!isCollapsibleContent) {
    for (var i = 0; i < coll.length; i++) {
      var con = coll[i].nextElementSibling;
      con.style.display = "none";
      coll[i].classList.remove("active");
    }
  }
});

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

// Usage for image1
setupImageModal("myImg", "imageModal", "img01", "caption", "closeImage");

// Usage for image2
setupImageModal("myImg2", "imageModal2", "img02", "caption2", "closeImage2");

// Usage for image3
setupImageModal("myImg3", "imageModal3", "img03", "caption3", "closeImage3");
