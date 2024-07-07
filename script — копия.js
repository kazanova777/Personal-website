document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navmenu = document.getElementById('navmenu');
    const container = document.getElementById('container');
    const intro = document.getElementById('intro');
    const staticIntro = document.getElementById('static-intro');
    const playGameBtn = document.getElementById('play-game');
    const gameElement = document.getElementById('game');
    let backgroundBalls = [];

    if (menuToggle && navmenu && container) {
        menuToggle.addEventListener('click', () => {
            navmenu.classList.toggle('visible');
            container.classList.toggle('shifted');
        });
    }

    // Create background balls for index.html
    if (intro && container) {
        for (let i = 0; i < 20; i++) {
            const ball = document.createElement('div');
            ball.classList.add('background-ball');
            ball.style.top = `${Math.random() * (container.clientHeight - 48)}px`;
            ball.style.left = `${Math.random() * (container.clientWidth - 48)}px`;
            ball.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
            ball.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
            ball.style.setProperty('--duration', `${Math.random() * 5 + 5}s`);
            container.appendChild(ball);
            backgroundBalls.push(ball);
        }
    }

    // Play game button logic
    if (playGameBtn && gameElement) {
        playGameBtn.addEventListener('click', () => {
            document.body.classList.add('game-mode');
            container.classList.add('game-mode');
            intro.classList.add('hidden');
            backgroundBalls.forEach(ball => ball.style.display = 'none'); // Hide blue balls
            setTimeout(() => {
                intro.style.display = 'none';
                gameElement.style.display = 'flex';
                startGame();
            }, 1000);
        });
    }

    function startGame() {
        const scoreDisplay = document.getElementById('score');
        const timerDisplay = document.getElementById('timer');
        const gameArea = document.getElementById('game-area');
        let score = 0;
        let gameInterval;
        let ballInterval;
        let gameDuration = 20000; // 20 seconds
        let ballSpeed = 2; // Ball speed in px per frame

        if (!scoreDisplay || !timerDisplay || !gameArea) {
            console.error('Game elements are missing');
            return;
        }

        console.log('Starting game');
        scoreDisplay.innerText = `Score: ${score}`;
        timerDisplay.innerText = `Time: ${gameDuration / 1000}`;
        gameArea.innerHTML = '';
        gameInterval = setInterval(updateTimer, 1000);
        ballInterval = setInterval(createBall, 1000);
        setTimeout(endGame, gameDuration);

        function updateTimer() {
            const currentTime = parseInt(timerDisplay.innerText.split(': ')[1]);
            if (currentTime > 0) {
                timerDisplay.innerText = `Time: ${currentTime - 1}`;
            }
        }

        function createBall() {
            const ball = document.createElement('div');
            ball.classList.add('red-ball');
            ball.style.top = `${Math.random() * (gameArea.clientHeight - 80)}px`;
            ball.style.left = `${Math.random() * (gameArea.clientWidth - 80)}px`;
            ball.addEventListener('click', () => {
                score++;
                scoreDisplay.innerText = `Score: ${score}`;
                ball.remove();
            });
            gameArea.appendChild(ball);
            moveBall(ball);
        }

        function moveBall(ball) {
            let dx = (Math.random() - 0.5) * 2 * ballSpeed;
            let dy = (Math.random() - 0.5) * 2 * ballSpeed;

            function updatePosition() {
                const rect = ball.getBoundingClientRect();
                const gameRect = gameArea.getBoundingClientRect();
                if (rect.top <= gameRect.top || rect.bottom >= gameRect.bottom) dy = -dy;
                if (rect.left <= gameRect.left || rect.right >= gameRect.right) dx = -dx;
                ball.style.top = `${ball.offsetTop + dy}px`;
                ball.style.left = `${ball.offsetLeft + dx}px`;
                if (gameArea.contains(ball)) {
                    requestAnimationFrame(updatePosition);
                }
            }
            requestAnimationFrame(updatePosition);
        }

        function endGame() {
            clearInterval(gameInterval);
            clearInterval(ballInterval);
            gameArea.innerHTML = '';
            alert(`Game over! Your score is ${score}`);
            gameElement.style.display = 'none';
            document.body.classList.remove('game-mode');
            container.classList.remove('game-mode');
            backgroundBalls.forEach(ball => ball.style.display = 'block'); // Show blue balls again
            intro.style.display = 'block';
            setTimeout(() => {
                intro.classList.remove('hidden');
            }, 1000);
        }
    }
});
