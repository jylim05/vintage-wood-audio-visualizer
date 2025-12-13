// ===== 변수 선언 =====
let sound;
let fft;
let amp;

let colorModeIndex = 0;

function preload() {
  sound = loadSound("music.mp3");
}

function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);

  fft = new p5.FFT();
  amp = new p5.Amplitude();
}

function draw() {
  background(80, 60, 40);
  noStroke();

  // -------------------------------
  // 우드 텍스처
  // -------------------------------
  for (let i = 0; i < height; i += 5) {
    stroke(100, 80, 55, 40);
    line(0, i, width, i);
  }
  noStroke();

  let waveform = fft.waveform();
  let level = amp.getLevel();

  // -------------------------------
  // 스피커 본체
  // -------------------------------
  fill(35);
  stroke(20);
  strokeWeight(3);
  rect(width/2 - 170, 60, 340, 380, 25);
  noStroke();

  // -------------------------------
  // 3개의 동일 크기 스피커 유닛
  // -------------------------------

  let baseX = width / 2;
  let unitSize = 90 + level * 20;   // 통일된 크기

  fill(160);
  ellipse(baseX, 140, unitSize);    // 유닛 1
  ellipse(baseX, 240, unitSize);    // 유닛 2
  ellipse(baseX, 340, unitSize);    // 유닛 3

  // -------------------------------
  // 양옆 작은 동그라미 버튼
  // -------------------------------
  fill(120);

  // 왼쪽 버튼 5개
  for (let i = 0; i < 5; i++) {
    ellipse(width/2 - 150, 110 + i * 65, 14);
  }

  // 오른쪽 버튼 5개
  for (let i = 0; i < 5; i++) {
    ellipse(width/2 + 150, 110 + i * 65, 14);
  }

  // -------------------------------
  // Play – Pause – Stop 버튼
  // -------------------------------
  drawControlButtons();

  // -------------------------------
  // 양옆 바 시각화
  // -------------------------------
  let barHeight = map(level, 0, 1, 10, 230);
  fill(120, 80, 40, 180);

  rect(80, height - barHeight - 60, 40, barHeight, 10);
  rect(width - 120, height - barHeight - 60, 40, barHeight, 10);

  // -------------------------------
  // 아래 파형
  // -------------------------------
  stroke(255, 200);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    let index = floor(map(i, 0, width, 0, waveform.length));
    let y = map(waveform[index], -1, 1, -40, 40);
    vertex(i, height - 20 + y);
  }
  endShape();
}

// -------------------------------
// Play / Pause / Stop 버튼 그리기
// -------------------------------
function drawControlButtons() {
  let bx = width/2;
  let by = 400;

  fill(220);
  noStroke();

  // PLAY 버튼 (삼각형)
  triangle(bx - 60, by - 15, bx - 60, by + 15, bx - 35, by);

  // PAUSE 버튼 (두 개의 직사각형)
  rect(bx - 5, by - 15, 8, 30, 3);
  rect(bx + 10, by - 15, 8, 30, 3);

  // STOP 버튼 (정사각형)
  rect(bx + 40, by - 15, 26, 26, 3);
}

// -------------------------------
// 버튼 클릭 반응
// -------------------------------
function mousePressed() {
  let bx = width/2;
  let by = 400;

  // PLAY 버튼
  if (mouseX > bx - 70 && mouseX < bx - 25 &&
      mouseY > by - 25 && mouseY < by + 25) {
    if (!sound.isPlaying()) sound.play();
  }

  // PAUSE 버튼
  if (mouseX > bx - 10 && mouseX < bx + 30 &&
      mouseY > by - 25 && mouseY < by + 25) {
    if (sound.isPlaying()) sound.pause();
  }

  // STOP 버튼
  if (mouseX > bx + 35 && mouseX < bx + 80 &&
      mouseY > by - 25 && mouseY < by + 25) {
    sound.stop();
  }
}

function keyPressed() {
  colorModeIndex = (colorModeIndex + 1) % 3;
}

