// ===== 변수 선언 =====
let sound;
let fft;
let amp;

let colorModeIndex = 0;
let started = false; // 처음 재생 버튼 상태용

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

  // ===== 따뜻한 우드 배경 =====
  background(140, 100, 60); 
  noStroke();
  for (let i = 0; i < height; i += 20) {
    fill(150 + sin(i) * 10, 110, 70);
    rect(0, i, width, 20);
  }

  // ===== 오디오 데이터 =====
  let waveform = fft.waveform();
  let level = amp.getLevel();

  // ===== 공통 색감 =====
  let col = map(level, 0, 1, 100, 255);

  // ===============================================
  //   1. 재생 전 상태 — 재생 버튼 UI
  // ===============================================
  if (!started) {

    // 스피커 본체 (재생 전에도 보여주기)
    fill(50); // 어두운 회색
    rect(width / 2 - 120, height / 2 - 180, 240, 360, 20);

    push();
    translate(width / 2, height / 2);
    fill(200); // 밝은 회색 스피커 유닛
    ellipse(0, 0, 180, 180);

    // ▶ 재생 버튼
    fill(0);
    noStroke();
    triangle(-20, -30, -20, 30, 20, 0);

    pop();

    fill(255);
    textAlign(CENTER);
    textSize(18);
    text("Click to Play", width / 2, height / 2 + 150);

    return;
  }

  // ===============================================
  //   2. 재생 후 시각화 영역
  // ===============================================

  // ===== 스피커 본체(Rectangle) =====
  fill(40); // 어두운 회색(본체)
  rect(width / 2 - 130, height / 2 - 220, 260, 440, 30);

  // ===== 스피커 유닛 2개 (위/아래 원) =====
  let size = map(level, 0, 1, 120, 200);

  // 위쪽 유닛
  push();
  translate(width / 2, height / 2 - 130);
  fill(220); // 밝은 회색
  ellipse(0, 0, size, size);
  pop();

  // 아래쪽 유닛
  push();
  translate(width / 2, height / 2 + 130);
  fill(220); // 밝은 회색
  ellipse(0, 0, size, size);
  pop();

  // ===== 양쪽 바(Bar) 시각화 =====
  let barHeight = map(level, 0, 1, 20, 260);

  // 왼쪽 바
  fill(255, 160, col);
  rect(80, height / 2 - barHeight / 2, 30, barHeight);

  // 오른쪽 바
  fill(255, 160, col);
  rect(width - 110, height / 2 - barHeight / 2, 30, barHeight);

  // ===== 아래 파형 =====
  stroke(255, 200, col);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    let index = floor(map(i, 0, width, 0, waveform.length));
    let y = map(waveform[index], -1, 1, -60, 60);
    vertex(i, height - 60 + y);
  }
  endShape();
}


// ===== 인터랙션 =====

function mousePressed() {
  if (!started) {
    started = true;
    sound.play();
    return;
  }

  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}

function keyPressed() {
  colorModeIndex = (colorModeIndex + 1) % 3;
}

