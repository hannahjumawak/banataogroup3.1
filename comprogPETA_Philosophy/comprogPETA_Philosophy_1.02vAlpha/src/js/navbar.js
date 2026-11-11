function initSideNavToggle() {
    const sideNavBtn = document.getElementById('side-nav-btn');
    const sideNav = document.getElementById('side-nav');

    if (sideNavBtn && sideNav) {
        sideNavBtn.addEventListener('click', function() {
            if (sideNav.classList.contains('active')) {
                sideNav.classList.remove('active');
            } else {
                sideNav.classList.add('active');
            }
        });
    }
}


const navbarPlaceholder = document.getElementById('navbar-placeholder');

fetch('../../src/html/navbar.html')
  .then(response => response.text())
  .then(data => {
     navbarPlaceholder.innerHTML = data;

    initSideNavToggle();
  }
);