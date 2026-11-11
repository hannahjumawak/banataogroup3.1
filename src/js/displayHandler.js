const panelDisplayer = document.getElementById('panel-displayer');

const fileTypeDirection = {
    'lecture': '../../src/html/lecture.html',
    'quiz': '../../src/html/quiz.html',
};

const params = new URLSearchParams(window.location.search);
const contentType = params.get('type'); // e.g. "Lecture"
const contentId = params.get('id');     // e.g. "1A" -- later use

const targetFile = fileTypeDirection[contentType];

if (targetFile) {
    fetch(targetFile)
        .then(response => {
            if (!response.ok) throw new Error("Template file not found");
            return response.text();
        })
        .then(htmlContent => {
            panelDisplayer.innerHTML = htmlContent;

            if (contentType === 'quiz') {
                initializeQuiz(contentId);
            } else if (contentType === 'lecture') {
                initializeLecture(contentId);
            }

        })
        .catch(error => {
            console.log("Attempting to load file from:", targetFile);
            panelDisplayer.innerHTML = "<h2>Could not load content layout.</h2>";
        });

} else {
    panelDisplayer.innerHTML = "<h2>Invalid or missing content type.</h2>";
}



function initializeQuiz(id) {
    console.log(`Quiz template is ready! Fetching data for ID: ${id}`);
    
    fetch('../../src/json/quizData.json')
        .then(response => response.json())
        .then(data => {
            const quizData = data[id];
            if (quizData) {
                console.log("Found quiz data:", quizData.title);
                runQuizEngine(quizData.questions);
            }
        });
}


function initializeLecture(id) {
    console.log(`Lecture template is ready! Loading PDF for ID: ${id}`);

    const lectureFiles = {
        '1A': '../../src/pdfs/l1.pdf',
        '2A': '../../src/pdfs/l2.pdf',
        '3A': '../../src/pdfs/l3.pdf',
        '4A': '../../src/pdfs/l4.pdf',
        '5A': '../../src/pdfs/l5.pdf',
        '6A': '../../src/pdfs/l6.pdf',
    };

    const pdfPath = lectureFiles[id];
    const pdfViewer = document.getElementById('pdfViewer');

    if (pdfPath && pdfViewer) {
        pdfViewer.src = pdfPath;
        console.log(`Loaded PDF: ${pdfPath}`);
    } else {
        console.error(`No PDF found for lecture ID: ${id}`);
        if (pdfViewer) {
            pdfViewer.srcdoc = "<h2>Error: Lecture PDF not found for this ID.</h2>";
        }
    }
}





function runQuizEngine(questions) {
    let currentIndex = 0;
    let score = 0;
    let selectedChoice = null; // Tracks what the user clicks ('A', 'B', 'C', or 'D')
    let isCheckedState = false;

    const statusText = document.querySelector('.statusText');
    const mainText = document.querySelector('.mainText');
    const choiceItems = document.querySelectorAll('.multipleChoice > li');
    const nextButton = document.getElementById('nextButton');

    function renderCurrentQuestion() { // initializes the questions
        const currentQ = questions[currentIndex];
        
        // Reset states for the new question
        selectedChoice = null;
        isCheckedState = false;
        nextButton.textContent = "Check";
        nextButton.removeAttribute('allowedToCheck');
        nextButton.removeAttribute('allowedToNext');

        choiceItems.forEach(li => {
            li.removeAttribute('chosen');
            li.removeAttribute('correct');
        });

        // Set text content
        statusText.textContent = currentQ.status;
        mainText.textContent = currentQ.text;
        
        document.querySelector('#cA .choiceText').textContent = currentQ.choices.A;
        document.querySelector('#cB .choiceText').textContent = currentQ.choices.B;
        document.querySelector('#cC .choiceText').textContent = currentQ.choices.C;
        document.querySelector('#cD .choiceText').textContent = currentQ.choices.D;
    }

    choiceItems.forEach(li => {
        const button = li.querySelector('button');
        const choiceValue = button.getAttribute('value'); // e.g. "cA", "cB" extract letter or match
        
        button.addEventListener('click', () => {
            if (isCheckedState) return;

            selectedChoice = button.value.replace('c', ''); 

            choiceItems.forEach(item => item.removeAttribute('chosen'));
            li.setAttribute('chosen', '');

            nextButton.setAttribute('allowedToCheck', '');
        });
    });

    // Handle clicking the main action button (acts as "Check" first, then "Next")
    nextButton.addEventListener('click', () => {
        if (!selectedChoice && !isCheckedState) return;

        const currentQ = questions[currentIndex];

        if (!isCheckedState) {
            isCheckedState = true;
            
            // Show the correct answer
            choiceItems.forEach(li => {
                const btn = li.querySelector('button');
                const btnLetter = btn.value.replace('c', '');
                
                if (btnLetter === currentQ.correct) {
                    li.setAttribute('correct', '');
                }
            });

            // Check if user got it right and tally score
            if (selectedChoice === currentQ.correct) {
                score++;
            }

            nextButton.textContent = "Next";
            nextButton.removeAttribute('allowedToCheck');
            nextButton.setAttribute('allowedToNext', '');

        } else {
            // --- ADVANCE TO NEXT QUESTION OR COMPLETE ---
            currentIndex++;

            if (currentIndex < questions.length) {
                renderCurrentQuestion();
            } else {
                // --- QUIZ COMPLETED ---
                const pct = Math.round((score / questions.length) * 100);

                document.querySelector('.content').style.display = 'none';

                document.querySelector('.victoryPanel .score').textContent = `Score: ${score} / ${questions.length}`;
                document.querySelector('.victoryPanel .accuracy').textContent = `Accuracy: ${pct}%`;

                document.querySelector('.victoryPanel').classList.add('active');
            }
        }
    });

    renderCurrentQuestion();
}