const auth = "563492ad6f91700001000001cc1b7c5984ad4522b075ed1967633c7e";

const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
const fotas = document.querySelector("header");

let logoCount = 0;
let page = 1;
let fetchLink;
let currentSearch;
let gallerySlide;
let gallerySlides;

fotas.addEventListener("click", (e) => {
  console.log(e.target);

  if (!e.target.classList.contains("search-input") && !e.target.classList.contains("submit-btn")) {
    e.preventDefault();
    if (logoCount % 2 === 0) {
      console.log("even");
      fotas.style.animation = "rotation 2s ease-in-out";
    } else {
      console.log("odd");
      fotas.style.animation = "rotation2 2s ease-in-out";
    }
    setTimeout(() => {
      fotas.style.animation = "";
      logoCount++;
    }, 2500);
  }
});

searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const { data } = await axios.get(url, {
    headers: {
      Authorization: auth,
    },
  });
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo, index) => {
    console.log(photo);
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <div class="gallery-info ">
    <p>${photo.photographer}</p>
    <a href=${photo.src.original}>Download</a>
    </div>
    <div class="img-container">
    <img src=${photo.src.large} class="image"></img>
      <div class="text  text-${index}">
        <p class="desc">Average Color: <span class="span-${index}">${photo.avg_color}</span></p>
        <p class="desc">More from them<a target="_blank"class="here-${index}" href="${photo.photographer_url}"> here</a></p>
      </div>
    </div>
    `;

    // i.style.backgroundColor = `${photo.avg_color}`;
    gallery.appendChild(galleryImg);
    document.querySelector(`.span-${index}`).style.color = `${photo.avg_color}`;
    document.querySelector(`.here-${index}`).style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  });
  els = document.querySelectorAll(".text");
  els.forEach((el) => {
    console.log(el);
    el.addEventListener("mouseenter", picToggle);
    el.addEventListener("mouseleave", picUnToggle);
  });
  let controller = new ScrollMagic.Controller();
  gallerySlides = document.querySelectorAll(".gallery-img");
  console.log(gallerySlide);
  gallerySlides.forEach((slide, index, slides) => {
    let slideInfo = slide.childNodes[1];
    // const slideTl = gsap.timeline({ defaults: { duration: 1, ease: "power1.inOut" } });
    // slideTl.fromTo(slide, { opacity: "0", x: "100%", y: "100%" }, { opacity: "1", x: "0%", y: "-100%" });
    // slideTl.fromTo(slideInfo, { opacity: "0", x: "100%", y: "100%" }, { opacity: "1", x: "0%", y: "-100%" });
    // slideScene = new ScrollMagic.Scene({
    //   triggerElement: slide,
    //   triggerHook: 0,
    // })
    //   .setPin(slide, { pushFollowers: true })
    //   .addIndicators()
    //   .setTween(slideTl)
    //   .addTo(controller);
    const pageTl = gsap.timeline();
    if (index % 2 == 0) {
      pageTl.fromTo(
        slide,
        { opacity: 1, scale: 1, x: "0%", y: "0" },
        { opacity: 0, scale: 0.5, x: "-100%", y: "-100%" },
      );
    } else {
      pageTl.fromTo(
        slide,
        { opacity: 1, scale: 1, x: "0%", y: "0" },
        { opacity: 0, scale: 0.5, x: "100%", y: "-100%" },
      );
    }
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function picUnToggle(e) {
  let node = e.target.classList[1];
  gsap.to(`.${node}`, 0.5, { opacity: 0 });
}

function picToggle(e) {
  let node = e.target.classList[1];
  gsap.to(`.${node}`, 0.5, { opacity: 1 });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(search) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${search}&per_page=15`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();
