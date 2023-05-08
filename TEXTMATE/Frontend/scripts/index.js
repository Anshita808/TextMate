function reveal() {
	var reveals = document.querySelectorAll(".reveal");

	for (var i = 0; i < reveals.length; i++) {
		var windowHeight = window.innerHeight;
		var elementTop = reveals[i].getBoundingClientRect().top;
		var elementVisible = 150;

		if (elementTop < windowHeight - elementVisible) {
			reveals[i].classList.add("active");
		} else {
			reveals[i].classList.remove("active");
		}
	}
}

window.addEventListener("scroll", reveal);

const feedbackText = document.querySelector(".feedback-text");
const starsContainer = document.querySelector(".feedback-stars");
const userPhoto = document.querySelector(".user-photo img");

const reviews = [
	{
		text: "I loved this product!",
		rating: 5,
	},
	{
		text: "It was good, but not great.",
		rating: 3,
	},
	{
		text: "I wouldn't buy this again.",
		rating: 2,
	},
	{
		text: "This was the worst product I've ever used.",
		rating: 1,
	},
	{
		text: "It was okay, but not worth the price.",
		rating: 3,
	},
];

let currentReviewIndex = 0;
let currentRating = 0;

function showReview(index) {
	const review = reviews[index];
	feedbackText.textContent = review.text;
	updateStars(review.rating);
}

function updateStars(rating) {
	if (currentRating === rating) {
		return;
	}

	const activeStars = document.querySelectorAll(".star.active");

	activeStars.forEach((star) => {
		star.classList.remove("active");
	});

	for (let i = 1; i <= rating; i++) {
		const star = document.querySelector(`.star .${i}`);
		star.classList.add("active");
	}

	currentRating = rating;
}

function changeReview() {
	if (currentReviewIndex === reviews.length - 1) {
		currentReviewIndex = 0;
	} else {
		currentReviewIndex++;
	}

	showReview(currentReviewIndex);
}

function init() {
	// Show the first review on page load
	showReview(currentReviewIndex);

	// Start the auto-changing of reviews
	setInterval(changeReview, 5000);
}

init();
