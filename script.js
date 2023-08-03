document.addEventListener("DOMContentLoaded", function () {
  // Navbarın responsive dizaynda açılması və bağlanması
  const navbar = document.querySelector(".navbar");
  const barsButton = document.getElementById("navbar-bars");

  barsButton.addEventListener("click", function () {
    barsButton.classList.toggle("fa-times");
    navbar.classList.toggle("active");
  });

  // Axtarış formunun search iconu ilə açılması və bağlanması
  const searchForm = document.getElementById("search-form");
  const [openFormIcon, closeFormIcon] = document.getElementsByClassName(
    "fa-magnifying-glass"
  );

  function toggleSearchForm() {
    searchForm.classList.toggle("active");
  }

  openFormIcon.addEventListener("click", toggleSearchForm);
  closeFormIcon.addEventListener("click", toggleSearchForm);

  // Axtarış formunun "X" iconu ilə bağlanması
  document.querySelector(".fa-xmark").addEventListener("click", () => {
    searchForm.classList.toggle("active");
  });

  // Swiperin js işə salan kod
  var swiper = new Swiper(".home-slider", {
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // NAVBAR aktiv link saxlayan
  const navLinks = document.querySelectorAll(".nav-link");

  function handleNavLinkClick(link) {
    navLinks.forEach((link) => link.classList.remove("active"));
    link.classList.add("active");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetSectionId = link.getAttribute("href");
      const targetSection = document.querySelector(targetSectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        handleNavLinkClick(link);
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const targetSectionId = `#${entry.target.id}`;
        const correspondingNavLink = document.querySelector(
          `a[href="${targetSectionId}"]`
        );
        if (entry.isIntersecting) handleNavLinkClick(correspondingNavLink);
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  document.querySelectorAll("section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  // COMMENTLƏRİ APİ-DAN FETCH ETMƏK

  async function fetchTestimonials() {
    try {
      const response = await fetch("https://dummyjson.com/comments");
      const data = await response.json();

      // Check if the data contains testimonials directly under the 'comments' property
      if (Array.isArray(data.comments)) {
        // Replace user ID 97 with user ID 36 and fetch the username for ID 36
        const updatedTestimonials = await Promise.all(
          data.comments.map(async (testimonial) => {
            if (testimonial.user.id === 97) {
              const user36 = await fetchUserById(36);
              return {
                ...testimonial,
                user: {
                  id: 36,
                  username: user36.username,
                },
              };
            } else {
              return testimonial;
            }
          })
        );

        // Extract the first 9 testimonials
        const testimonials = updatedTestimonials.slice(0, 9);

        updateTestimonials(testimonials);
      } else {
        throw new Error("Invalid data format. Testimonials not found.");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error.message);
    }
  }

  // Function to fetch user details by ID from the API

  async function fetchUserById(userId) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`);
      const user = await response.json();
      return user;
    } catch (error) {
      throw new Error("Error fetching user from the API:", error.message);
    }
  }

  // Function to update testimonials
  function updateTestimonials(data) {
    const reviewSlider = document.querySelector(".review-slider");
    const swiperWrapper = reviewSlider.querySelector(".swiper-wrapper");

    // Clear existing testimonials
    swiperWrapper.innerHTML = "";

    // Iterate through the fetched data and update testimonials
    data.forEach((testimonial) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      // Testimonial card content
      slide.innerHTML = `
      <div class="testimonial-card">
        <div class="testimonial-card-upper">
          <img src="assets/images/profile-pictures/${testimonial.user.id}.png" alt="Profile Picture" class="testimonial-image">
          <div class="testimonial-info">
            <h2 class="card-heading">${testimonial.user.username}</h2>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star-half-stroke"></i>
            </div>
          </div>
          <i class="fa-solid fa-quote-left" style="color: #20ae60"></i>
        </div>
        <div class="testimonial-card-lower">
          <p>${testimonial.body}</p>
        </div>
      </div>
    `;

      swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper after updating the testimonials
    var swiper = new Swiper(".review-slider", {
      slidesPerView: 3,
      spaceBetween: 30,
      breakpoints: {
        319: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        720: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    });
  }

  // Call the function to fetch and update testimonials on page load
  fetchTestimonials();

  // FORM KODLARI

  const form = document.getElementById("orderForm");
  const nameInput = form.name;
  const orderInput = form.order;
  const amountInput = form.amount;
  const addressInput = form.address;
  const numberInput = form.number;
  const dateTimeInput = form.dateTime;
  const messageInput = form.message;
  const additionalFoodInput = form.additionalFood;

  const nameError = document.getElementById("nameError");
  const orderError = document.getElementById("orderError");
  const amountError = document.getElementById("amountError");
  const addressError = document.getElementById("addressError");
  const numberError = document.getElementById("numberError");
  const dateTimeError = document.getElementById("dateTimeError");
  const messageError = document.getElementById("messageError"); // Add this line to define the messageError variable

  // Add event listener for form submission
  form.addEventListener("submit", validateForm);

  // Function to show error message for an input field
  function showError(element, message) {
    const errorElement = element.nextElementSibling;
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Function to hide error message for an input field
  function hideError(element) {
    const errorElement = element.nextElementSibling;
    errorElement.style.display = "none";
  }

  // REAL-TIME VALIDATION
  function validateNumberInput() {
    const phoneNumberPattern =
      /(?:0|994)(?:12|51|50|55|70|77)[^\w]{0,2}[2-9][0-9]{2}[^\w]{0,2}[0-9]{2}[^\w]{0,2}[0-9]{2}/;
    const phoneNumber = numberInput.value.trim();

    if (!phoneNumberPattern.test(phoneNumber)) {
      showError(
        numberInput,
        "Zəhmət olmasa, düzgün bir telefon nömrəsi daxil edin."
      );
      return false;
    }

    if (phoneNumber.startsWith("+994") && phoneNumber.length > 13) {
      showError(
        numberInput,
        "Telefon nömrəsi formatı +994(xx)xxx-xx-xx olmalıdır (maksimum uzunluq: 13)."
      );
      return false;
    }

    if (phoneNumber.startsWith("0") && phoneNumber.length > 10) {
      showError(
        numberInput,
        "Telefon nömrəsi formatı (xxx)xxx-xx-xx olmalıdır (maksimum uzunluq: 10)."
      );
      return false;
    }

    hideError(numberInput);
    return true;
  }

  numberInput.addEventListener("input", validateNumberInput);

  function validateNameInput() {
    const name = nameInput.value.trim();

    if (name === "") {
      showError(nameInput, "Adınızı daxil edin.");
      return false;
    } else if (name.length < 5) {
      showError(nameInput, "Adınız ən azı 5 hərf olmalıdır.");
      return false;
    } else if (/\d/.test(name)) {
      showError(nameInput, "Adınızda rəqəm olmamalıdır.");
      return false;
    } else {
      hideError(nameInput);
      return true;
    }
  }

  nameInput.addEventListener("input", validateNameInput);

  function validateOrderInput() {
    const order = orderInput.value.trim();

    if (order === "") {
      showError(orderInput, "Sifarişinizi daxil edin.");
      return false;
    } else {
      hideError(orderInput);
      return true;
    }
  }

  orderInput.addEventListener("input", validateOrderInput);

  function validateAmountInput() {
    const parsedAmount = parseInt(amountInput.value.trim(), 10);

    if (
      amountInput.value.trim() === "" ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      showError(amountInput, "Zəhmət olmasa, düzgün miqdar daxil edin.");
      return false;
    } else {
      hideError(amountInput);
      return true;
    }
  }

  amountInput.addEventListener("input", validateAmountInput);

  function validateAddressInput() {
    const address = addressInput.value.trim();

    if (address === "") {
      showError(addressInput, "Ünvanınızı daxil edin.");
      return false;
    } else {
      hideError(addressInput);
      return true;
    }
  }

  addressInput.addEventListener("input", validateAddressInput);

  function validateDateTimeInput() {
    const selectedDateTime = new Date(dateTimeInput.value);
    const currentDateTime = new Date();

    if (
      dateTimeInput.value.trim() === "" ||
      selectedDateTime <= currentDateTime
    ) {
      showError(dateTimeInput, "Tarix seçiminizi düzgün edin.");
      return false;
    } else {
      hideError(dateTimeInput);
      return true;
    }
  }

  dateTimeInput.addEventListener("input", validateDateTimeInput);

  function sendFormData() {
    const formData = {
      name: nameInput.value,
      order: orderInput.value,
      amount: amountInput.value,
      address: addressInput.value,
      number: numberInput.value,
      additionalFood: additionalFoodInput.value,
      dateTime: dateTimeInput.value,
      message: messageInput.value,
    };

    console.log(formData); // Add this line to log the form data

    // Replace these values with your own Email.js service ID, template ID, and user ID
    const serviceID = "service_fposlvv";
    const templateID = "template_gs6pp8s";
    const userID = "7VaSY_4c4BL9rmhnR";

    // Send the form data via Email.js
    emailjs
      .send(serviceID, templateID, formData, userID)
      .then((response) => {
        console.log("Email sent successfully!", response);

        // Show a success alert
        Swal.fire({
          title: "Möhtəşəm!",
          text: "Sifarişiniz göndərildi!",
          icon: "success",
          confirmButtonText: "Əla 😍",
        });

        // Optionally, you can submit the form after sending the email
        // form.submit();
      })
      .catch((error) => {
        console.error("Error sending email:", error);

        // Show an error alert
        Swal.fire({
          title: "Əfsus!",
          text: "Məlumatlarda səhvlik var!",
          icon: "fail",
          confirmButtonText: "Tamam 😒",
        });
      });
  }

  // Add event listener for form submission
  form.addEventListener("submit", validateForm);

  // Function to validate the entire form
  function validateForm(event) {
    event.preventDefault();

    // Validate all inputs
    const isNameValid = validateNameInput();
    const isOrderValid = validateOrderInput();
    const isAmountValid = validateAmountInput();
    const isAddressValid = validateAddressInput();
    const isNumberValid = validateNumberInput();
    const isDateTimeValid = validateDateTimeInput();

    if (
      isNameValid &&
      isOrderValid &&
      isAmountValid &&
      isAddressValid &&
      isNumberValid &&
      isDateTimeValid
    ) {
      sendFormData();
    }
  }

  // LOADER
  window.onload = () =>
    setTimeout(
      () =>
        document.querySelector(".loader-container").classList.add("fade-out"),
      3000
    );
});
