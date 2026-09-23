const menuToggle = document.querySelector('.menu-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const menuLinks = document.querySelectorAll('#primary-menu a');
const currentYear = document.querySelector('#current-year');
const themeToggle = document.querySelector('.theme-toggle');

if (currentYear) {
	currentYear.textContent = new Date().getFullYear();
}

if (themeToggle) {
	const savedTheme = localStorage.getItem('portfolio-theme');

	if (savedTheme === 'dark') {
		document.body.classList.add('dark-mode');
	}

	const updateThemeButton = () => {
		const isDarkMode = document.body.classList.contains('dark-mode');
		const icon = themeToggle.querySelector('span:not(.sr-only)');
		const label = themeToggle.querySelector('.sr-only');

		icon.textContent = isDarkMode ? '\u2600' : '\u263d';
		label.textContent = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
		themeToggle.setAttribute('aria-label', label.textContent);
		themeToggle.setAttribute('aria-pressed', String(isDarkMode));
	};

	updateThemeButton();

	themeToggle.addEventListener('click', () => {
		const isDarkMode = document.body.classList.toggle('dark-mode');

		localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');
		updateThemeButton();
	});
}

if (menuToggle && primaryMenu) {
	menuToggle.addEventListener('click', () => {
		const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

		menuToggle.setAttribute('aria-expanded', String(!isOpen));
		primaryMenu.classList.toggle('is-open', !isOpen);
	});

	menuLinks.forEach((link) => {
		link.addEventListener('click', () => {
			menuToggle.setAttribute('aria-expanded', 'false');
			primaryMenu.classList.remove('is-open');
		});
	});
}
