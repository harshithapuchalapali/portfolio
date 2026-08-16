/* ============================================================
   Harshitha Puchalapalli — Portfolio interactions
   ============================================================ */

/* ---------- Navbar scroll state + active link ---------- */
const nav = document.getElementById('nav');

function highlightLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  let current = '';

  sections.forEach((section) => {
    const top = window.scrollY + 120;
    const offset = section.offsetTop;
    const height = section.offsetHeight;
    if (top >= offset && top < offset + height) {
      current = section.getAttribute('id');
    }
  });

  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

function onScroll() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  highlightLink();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

/* ---------- Blinking cursor for hero role text ---------- */
const roleEl = document.querySelector('.hero__role');
if (roleEl) {
  const text = roleEl.childNodes[0].textContent.trim();
  const cursor = document.createElement('span');
  cursor.className = 'blink-cursor';
  roleEl.childNodes[0].textContent = text;
  roleEl.appendChild(cursor);
}

/* ---------- Scroll reveal (replays each time) ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else {
        entry.target.classList.remove('in');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- 3D tilt on avatar ---------- */
const avatarWrap = document.querySelector('.avatar-wrap');
if (avatarWrap) {
  const area = avatarWrap.parentElement;
  area.addEventListener('mousemove', (e) => {
    const rect = area.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    avatarWrap.style.transform =
      'rotateY(' + (px * 16).toFixed(2) + 'deg) rotateX(' + (-py * 16).toFixed(2) + 'deg)';
  });
  area.addEventListener('mouseleave', () => {
    avatarWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* ---------- Scroll parallax (aurora blobs) ---------- */
const hero = document.querySelector('.hero');
const auroraBlobs = document.querySelectorAll('.aurora__blob');

function onParallax() {
  if (!hero) return;
  const y = window.scrollY;
  if (y < window.innerHeight * 1.5) {
    auroraBlobs.forEach((blob, i) => {
      const speed = (i + 1) * 0.06;
      blob.style.transform = 'translateY(' + (y * speed) + 'px)';
    });
  }
}

window.addEventListener('scroll', onParallax, { passive: true });
onParallax();

/* ---------- Magnetic hover buttons ---------- */
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* ---------- Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Contact form (FormSubmit -> Gmail) ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmit = document.getElementById('contactSubmit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = contactSubmit.textContent;
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const res = await fetch('https://formsubmit.co/ajax/harshithapuchalapali@gmail.com', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      const data = await res.json().catch(() => null);
      const ok = res.ok && data && String(data.success) === 'true';

      if (ok) {
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.classList.add('form-status--success');
        contactForm.reset();
      } else {
        const msg = data && data.message ? data.message : 'FormSubmit may not be activated yet.';
        formStatus.textContent = 'Not delivered: ' + msg;
        formStatus.classList.add('form-status--error');
      }
    } catch (err) {
      formStatus.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
      formStatus.classList.add('form-status--error');
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = originalText;
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 8000);
    }
  });
}