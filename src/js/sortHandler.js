document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".filterCheckbox");
    const cards = document.querySelectorAll(".Card");


function filterCards() {
    const activeFilters = Array.from(checkboxes).filter()
}



 const activeFilters = Array.from(checkboxes).filter(checkbox => checkbox.checked)

    function filterCards() {
        const activeFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        cards.forEach(card => {
            const tags = card.querySelectorAll(".GenreTags li");
            const cardClasses = [];
            
            tags.forEach(tag => {
                cardClasses.push(...tag.classList);
            });

            if (activeFilters.length === 0) {
                card.style.display = "flex";
                return;
            }

            const matchesFilter = activeFilters.some(filter => cardClasses.includes(filter));

            if (matchesFilter) {
                card.style.display = "flex"; 
            } else {
                card.style.display = "none"; 
            }
        });
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", filterCards);
    });
});



const clearBtn = document.querySelector('.clearCheckboxes');

clearBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.filterCheckbox');
    checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  
});