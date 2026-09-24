const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const menuLinks = document.querySelectorAll('#primary-menu a');
const currentYear = document.querySelector('#current-year');
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

const getSavedTheme = () => {
	try {
		const savedTheme = localStorage.getItem('portfolio-theme');

		return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
	} catch {
		return null;
	}
};

const saveTheme = (theme) => {
	try {
		localStorage.setItem('portfolio-theme', theme);
	} catch {
		// The selected theme still applies for this page view.
	}
};

const systemPrefersDark = () => (
	typeof window.matchMedia === 'function'
	&& window.matchMedia('(prefers-color-scheme: dark)').matches
);

const updateThemeButton = () => {
	if (!themeToggle) {
		return;
	}

	const isDarkMode = root.dataset.theme === 'dark';
	const icon = themeToggle.querySelector('span:not(.sr-only)');
	const label = themeToggle.querySelector('.sr-only');

	if (icon) {
		icon.textContent = isDarkMode ? '\u2600' : '\u263d';
	}

	if (label) {
		label.textContent = 'Dark mode';
	}

	themeToggle.setAttribute('aria-label', 'Dark mode');
	themeToggle.setAttribute('aria-pressed', String(isDarkMode));

	if (themeColor) {
		themeColor.setAttribute('content', isDarkMode ? '#171918' : '#f4f2ed');
	}
};

const setTheme = (theme, persist = false) => {
	const nextTheme = theme === 'dark' ? 'dark' : 'light';
	root.dataset.theme = nextTheme;

	if (persist) {
		saveTheme(nextTheme);
	}

	updateThemeButton();
};

if (currentYear) {
	currentYear.textContent = new Date().getFullYear();
}

if (themeToggle) {
	const savedTheme = getSavedTheme();
	setTheme(savedTheme || (systemPrefersDark() ? 'dark' : 'light'));

	themeToggle.addEventListener('click', () => {
		setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
	});
}

if (typeof window.matchMedia === 'function') {
	const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const handleSystemThemeChange = (event) => {
		if (!getSavedTheme()) {
			setTheme(event.matches ? 'dark' : 'light');
		}
	};

	if (typeof colorSchemeQuery.addEventListener === 'function') {
		colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
	} else if (typeof colorSchemeQuery.addListener === 'function') {
		colorSchemeQuery.addListener(handleSystemThemeChange);
	}
}

const setMenuOpen = (isOpen, focusToggle = false) => {
	if (!menuToggle || !primaryMenu) {
		return;
	}

	const actionLabel = isOpen ? 'Close navigation menu' : 'Open navigation menu';
	const hiddenLabel = menuToggle.querySelector('.sr-only');

	menuToggle.setAttribute('aria-expanded', String(isOpen));
	menuToggle.setAttribute('aria-label', actionLabel);
	menuToggle.classList.toggle('is-open', isOpen);
	primaryMenu.classList.toggle('is-open', isOpen);

	if (hiddenLabel) {
		hiddenLabel.textContent = actionLabel;
	}

	if (focusToggle) {
		menuToggle.focus();
	}
};

if (menuToggle && primaryMenu) {
	const navigation = document.querySelector('nav');
	const brand = document.querySelector('.brand');

	setMenuOpen(false);

	menuToggle.addEventListener('click', () => {
		const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
		setMenuOpen(!isOpen);
	});

	menuLinks.forEach((link) => {
		link.addEventListener('click', () => {
			setMenuOpen(false);
		});
	});

	if (brand) {
		brand.addEventListener('click', () => {
			setMenuOpen(false);
		});
	}

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
			event.preventDefault();
			setMenuOpen(false, true);
		}
	});

	document.addEventListener('click', (event) => {
		const menuIsOpen = menuToggle.getAttribute('aria-expanded') === 'true';

		if (menuIsOpen && navigation && !navigation.contains(event.target)) {
			setMenuOpen(false);
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth > 700 && menuToggle.getAttribute('aria-expanded') === 'true') {
			setMenuOpen(false);
		}
	});

	root.classList.add('js-enabled');
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

const setFormBusy = (isBusy) => {
	if (!contactForm || !submitButton) {
		return;
	}

	contactForm.setAttribute('aria-busy', String(isBusy));
	submitButton.disabled = isBusy;
	submitButton.setAttribute('aria-disabled', String(isBusy));
};

if (contactForm && formStatus && submitButton && typeof window.fetch === 'function') {
	const ajaxEndpoint = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		setFormBusy(true);
		formStatus.classList.remove('is-error');
		formStatus.textContent = 'Sending your message…';

		const payload = {};
		new FormData(contactForm).forEach((value, key) => {
			payload[key] = value;
		});

		try {
			const response = await fetch(ajaxEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			let result = null;

			try {
				result = await response.json();
			} catch {
				// A successful response does not always include a JSON body.
			}

			const submissionSucceeded = result && (result.success === true || result.success === 'true');

			if (!response.ok || !submissionSucceeded) {
				throw new Error('The contact form could not be submitted.');
			}

			contactForm.reset();
			formStatus.textContent = 'Thanks — your message was sent successfully.';
		} catch {
			formStatus.classList.add('is-error');
			formStatus.textContent = 'Something went wrong. Please try again or use the email link above.';
		} finally {
			setFormBusy(false);
		}
	});

	window.addEventListener('pageshow', () => {
		if (contactForm.getAttribute('aria-busy') === 'true') {
			setFormBusy(false);
		}
	});
}
