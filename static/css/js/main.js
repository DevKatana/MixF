"use strict";

/* Демо-коллекция фильмов */
let movies = [
  {
    id: 1,
    title: "Интерстеллар",
    year: 2014,
    rating: 5,
    review: "Космическая история о времени, любви и выборе, которая каждый раз звучит по-новому. Музыка Циммера буквально пробирает до мурашек.",
    poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    title: "Тёмный рыцарь",
    year: 2008,
    rating: 5,
    review: "Не просто фильм по комиксам, а идеальный криминальный эпос. Джокер Хита Леджера остаётся одним из самых сильных экранных антагонистов.",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    title: "Железный человек",
    year: 2008,
    rating: 4,
    review: "Роберт Дауни — младший сделал Тони Старка живым, ироничным и невероятно харизматичным. С этого фильма началась большая эпоха.",
    poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7454?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    title: "Бегущий по лезвию 2049",
    year: 2017,
    rating: 5,
    review: "Гипнотическая визуальная поэзия. Каждая сцена выглядит как картина, а история задаёт очень человеческие вопросы.",
    poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    title: "Дюна",
    year: 2021,
    rating: 4,
    review: "Монументальное начало большой истории. Великолепный звук, масштаб и атмосфера суровой планеты Арракис.",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    title: "Отряд самоубийц",
    year: 2016,
    rating: 2,
    review: "Интересные персонажи и хорошая музыка не смогли собрать историю в цельное кино. Ожиданий было гораздо больше.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=85"
  }
];

let activeRating = "all";
let selectedRating = 0;

const moviesGrid = document.getElementById("moviesGrid");
const emptyState = document.getElementById("emptyState");
const moviesCounter = document.getElementById("moviesCounter");
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
const filterButtons = document.querySelectorAll(".filter-button");

const modal = document.getElementById("movieModal");
const openModalButton = document.getElementById("openModalButton");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const movieForm = document.getElementById("movieForm");
const ratingPicker = document.getElementById("ratingPicker");
const ratingInput = document.getElementById("movieRating");
const pickerStars = document.querySelectorAll(".picker-star");

/* Возвращает цвет верхней полосы карточки в зависимости от оценки */
function getRatingColor(rating) {
  const colors = {
    5: "#ffd700",
    4: "#e50914",
    3: "#ffb700",
    2: "#8d1020",
    1: "#5f0b18"
  };

  return colors[rating] || "#ffd700";
}

/* Генерирует строку с заполненными и пустыми звёздами */
function createStars(rating) {
  let stars = "";

  for (let index = 1; index <= 5; index += 1) {
    stars += index <= rating
      ? '<span aria-hidden="true">★</span>'
      : '<span class="empty-star" aria-hidden="true">★</span>';
  }

  return stars;
}

/* Отрисовывает карточки с учётом поиска и выбранного фильтра */
function renderMovies() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  const filteredMovies = movies.filter((movie) => {
    const matchesRating = activeRating === "all" || movie.rating === Number(activeRating);
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery);

    return matchesRating && matchesSearch;
  });

  moviesGrid.innerHTML = filteredMovies.map((movie, index) => `
    <article
      class="movie-card"
      style="--rating-color: ${getRatingColor(movie.rating)}; animation-delay: ${index * 0.06}s"
    >
      <div class="movie-poster">
        <img src="${movie.poster}" alt="Постер фильма «${movie.title}»">
      </div>

      <div class="movie-content">
        <p class="movie-year">${movie.year}</p>
        <h3 class="movie-title">${movie.title}</h3>

        <div class="stars" aria-label="Оценка: ${movie.rating} из 5">
          ${createStars(movie.rating)}
        </div>

        <p class="movie-review">${movie.review}</p>

        <div class="card-actions">
          <button class="card-action" type="button" data-action="edit" data-id="${movie.id}">
            Редактировать
          </button>
          <button class="card-action delete" type="button" data-action="delete" data-id="${movie.id}">
            Удалить
          </button>
        </div>
      </div>
    </article>
  `).join("");

  moviesCounter.textContent = `Найдено: ${filteredMovies.length}`;
  emptyState.classList.toggle("hidden", filteredMovies.length !== 0);
}

/* Выпадающее меню поиска */
function renderSearchDropdown() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchDropdown.classList.remove("show");
    searchDropdown.innerHTML = "";
    return;
  }

  const results = movies
    .filter((movie) => movie.title.toLowerCase().includes(query))
    .slice(0, 3);

  if (results.length === 0) {
    searchDropdown.classList.remove("show");
    return;
  }

  searchDropdown.innerHTML = results.map((movie) => `
    <div class="search-result">
      <img src="${movie.poster}" alt="">
      <div>
        <strong>${movie.title}</strong>
        <small>${movie.year} · ${movie.rating} ★</small>
      </div>
    </div>
  `).join("");

  searchDropdown.classList.add("show");
}

/* Открытие модального окна */
function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("movieTitle").focus();
}

/* Закрытие модального окна */
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  movieForm.reset();
  setPickerRating(0);
}

/* Показывает выбранную оценку в интерактивном выборе звёзд */
function setPickerRating(rating) {
  selectedRating = rating;
  ratingInput.value = rating;

  pickerStars.forEach((star) => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle("selected", starValue <= rating);
    star.setAttribute("aria-checked", starValue === rating ? "true" : "false");
  });
}

/* Фильтрация по оценке */
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRating = button.dataset.rating;

    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    renderMovies();
  });
});

/* Живой поиск */
searchInput.addEventListener("input", () => {
  renderMovies();
  renderSearchDropdown();
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    searchDropdown.classList.remove("show");
  }, 180);
});

/* Модальное окно */
openModalButton.addEventListener("click", openModal);

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

/* Выбор звёзд: клик и предпросмотр при наведении */
pickerStars.forEach((star) => {
  star.addEventListener("click", () => {
    setPickerRating(Number(star.dataset.value));
  });

  star.addEventListener("mouseenter", () => {
    const hoverRating = Number(star.dataset.value);

    pickerStars.forEach((pickerStar) => {
      pickerStar.classList.toggle(
        "selected",
        Number(pickerStar.dataset.value) <= hoverRating
      );
    });
  });
});

ratingPicker.addEventListener("mouseleave", () => {
  setPickerRating(selectedRating);
});

/* Добавление новой карточки */
movieForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (selectedRating === 0) {
    alert("Пожалуйста, выберите оценку фильма.");
    return;
  }

  const formData = new FormData(movieForm);
  const title = formData.get("title").trim();
  const year = formData.get("year");
  const review = formData.get("review").trim();

  const newMovie = {
    id: Date.now(),
    title,
    year,
    rating: selectedRating,
    review,
    poster: `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85&sig=${Date.now()}`
  };

  movies.unshift(newMovie);
  activeRating = "all";

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.rating === "all");
  });

  searchInput.value = "";
  renderMovies();
  closeModal();
});

/* Действия на карточках: демо-редактирование и удаление */
moviesGrid.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const movieId = Number(actionButton.dataset.id);
  const action = actionButton.dataset.action;
  const movie = movies.find((item) => item.id === movieId);

  if (action === "delete") {
    const confirmed = confirm(`Удалить фильм «${movie.title}» из коллекции?`);

    if (confirmed) {
      movies = movies.filter((item) => item.id !== movieId);
      renderMovies();
    }
  }

  if (action === "edit") {
    alert(`Демо-режим: редактирование фильма «${movie.title}» можно подключить к форме аналогично добавлению.`);
  }
});

renderMovies();