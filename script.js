window.addEventListener("load", start);

function start() {
  console.log("JavaScript is running");
  document.addEventListener("keydown", keypressHandler);
  document.addEventListener("keyup", keypressHandler);

  createAsteroids();

  requestAnimationFrame(tick);
}

function keypressHandler(event) {
  const value = event.type === "keydown";
  const key = event.key;
  if (key === "a" || key === "ArrowLeft") controls.left = value;
  if (key === "w" || key === "ArrowUp") controls.up = value;
  if (key === "s" || key === "ArrowDown") controls.down = value;
  if (key === "d" || key === "ArrowRight") controls.right = value;
  if (key === " ") fireShot();
}

const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false,
};

let points = 0;
const shots = [];

function fireShot() {
    const div = document.createElement("div");
    div.classList.add("shot");

    document.querySelector("#gamefield").insertAdjacentElement("beforeend", div);
    const shot = {
      x: spaceship.x,
      y: spaceship.y,
      w: 50,
      h: 50,
      s: Math.random() * 100 + 50,
      visual: div,
    };
    shots.push(shot);
}

function moveShots(delta) {
  for (const shot of shots) {
    shot.y -= shot.s * delta;
    if (shot.y < 0) {
      removeShot(shot);
    }
  }
}

function removeShot(shot) {
  console.warn("NOT IMPLEMENTED");
}

const asteroids = [];

function createAsteroids() {
  for (let i = 0; i < 10; i++) {
    const div = document.createElement("div");
    div.classList.add("asteroid");

    document.querySelector("#gamefield").insertAdjacentElement("beforeend", div);
    const obj = {
      x: Math.floor(Math.random() * 750),
      y: -30,
      w: 50,
      h: 50,
      s: Math.random() * 100 + 50,
      visual: div,
    };
    asteroids.push(obj);
  }
}

function moveAsteroids(delta) {
  for (const asteroid of asteroids) {
    asteroid.y += asteroid.s * delta;
    if (asteroid.y > 450) {
      asteroid.y = -30;
      asteroid.x = Math.floor(Math.random() * 750);
    }
  }
}


const spaceship = {
  x: 380,
  y: 370,
  s: 300,
  w: 60,
  h: 80,
  hl: 100,
};

function moveSpaceship(delta) {
  if (controls.left && spaceship.x > spaceship.w / 2) {
    spaceship.x -= spaceship.s * delta;
  } else if (controls.right && spaceship.x < 770) {
    spaceship.x += spaceship.s * delta;
  }

  if (controls.up && spaceship.y > spaceship.h / 2) {
    spaceship.y -= spaceship.s * delta;
  } else if (controls.down && spaceship.y < 410) {
    spaceship.y += spaceship.s * delta;
  }

}

let lastTime = 0;

function tick(timestamp) {
  requestAnimationFrame(tick);

  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  moveSpaceship(delta);
  moveAsteroids(delta);
  moveShots(delta);

  for (const asteroid of asteroids) {
    if (isColliding(asteroid, spaceship)) {
      slowDown(asteroid);
      loseHealth(spaceship);
    }
  }

  function slowDown(asteroid) {
    asteroid.s *= 0.95;
  }

  function loseHealth(spaceship) {
    spaceship.hl--;
  }

  function isColliding(asteroid, spaceship) {
    return distance(asteroid, spaceship) < combinedSize(asteroid, spaceship)
  }

  function distance(objA, objB) {
    return Math.sqrt(Math.pow(objA.x - objB.x, 2) + Math.pow(objA.y - objB.y, 2));
  }

  function combinedSize(objA, objB) {
    return objA.w / 2 + objB.w / 2;
  }

  const visualSpaceShip = document.querySelector(".spaceship");
  visualSpaceShip.style.translate = `${spaceship.x - spaceship.w / 2}px ${spaceship.y - spaceship.h / 2}px`;

  for (const asteroid of asteroids) {
    asteroid.visual.style.translate = `${asteroid.x - 25}px ${asteroid.y - 25}px`;
  }

  document.querySelector("#score #number").textContent = String(points).padStart(3, "0");
  document.querySelector("#healthbar").style.width = `${spaceship.hl}%`;
}
