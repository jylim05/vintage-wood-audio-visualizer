// ===== 변수 =====
let sound;
let fft;
let amp;

// 재생바 설정 (중앙 배치)
let progressBarW = 500;
let progressBarH = 10;

// 버튼
let buttonY = 80;
let spacing = 70;

function preload() {
  sound = loadSound("music.mp3");
}

function setup() {
  createCanvas(900, 500);
  angleMode(DEGREES);

  fft = new p5.FFT();
  amp = new p5.Amplitude();
}

function draw() {
  background(80, 60, 40);
  noStroke();

  // 우드 텍스처
  for (let i = 0; i < height; i += 5) {
    stroke(100, 80, 55, 40);
    line(0, i, width, i);
  }
  noStroke();

  let waveform = fft.waveform();
  let level = amp.getLevel();

  // 중앙 재생바 위치 계산
  let progressBarX = width/2 - progressBarW/2;
  let progressBarY = 40;

  // 메인 스피커 (중앙)
  drawMainSpeaker(level);

  // 미니 스피커 두 개 (더 미니 C 사이즈)
  drawMiniSpeaker(width/2 - 220, level);
  drawMiniSpeaker(width/2 + 220, level);

  // LED
  drawLED();

  // 재생바
  drawProgressBar(progressBarX, progressBarY);

  // Play / Pause / Stop 버튼
  drawControlButtons();

  // 양옆 레벨 바
  let barHeight = map(level, 0, 1, 10, 200);
  fill(120, 80, 40, 180);
  rect(80, height - barHeight - 60, 35, barHeight, 10);
  rect(width - 115, height - barHeight - 60, 35, barHeight, 10);

  // 하단 파형
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

// =======================================================
// 메인 스피커
// =======================================================
function drawMainSpeaker(level) {
  fill(35);
  stroke(20);
  strokeWeight(3);
  rect(width/2 - 140, 110, 280, 300, 25);
  noStroke();

  let baseX = width / 2;
  let unitSize = 70 + level * 20;

  // 스피커 유닛 3개
  fill(170);
  ellipse(baseX, 180, unitSize);
  ellipse(baseX, 260, unitSize);
  ellipse(baseX, 340, unitSize);

  // 양옆 조작 버튼 5개씩
  fill(130);
  for (let i = 0; i < 5; i++) {
    ellipse(width/2 - 120, 160 + i * 50, 12);
    ellipse(width/2 + 120, 160 + i * 50, 12);
  }
}

// =======================================================
// 미니 스피커 (C 옵션: 아주 미니)
// =======================================================
function drawMiniSpeaker(centerX, level) {
  fill(45);
  stroke(20);
  strokeWeight(3);
  rect(centerX - 35, 170, 70, 170, 15);
  noStroke();

  let unitSize = 35 + level * 12;

  fill(170);
  ellipse(centerX, 220, unitSize);
  ellipse(centerX, 290, unitSize);
}

// =======================================================
// LED
// =======================================================
function drawLED() {
  let ctx = drawingContext;

  ctx.shadowBlur = 12;
  ctx.shadowColor = sound.isPlaying()
    ? "rgba(0,255,80,0.9)"
    : "rgba(255,60,60,0.9)";

  fill(sound.isPlaying() ? color(0, 255, 80) : color(255, 60, 60));
  ellipse(width/2, 135, 14);

  ctx.shadowBlur = 0;
}

// =======================================================
// 재생바
// =======================================================
function drawProgressBar(x, y) {
  fill(200);
  rect(x, y, progressBarW, progressBarH, 5);

  if (sound.duration() > 0) {
    let percent = sound.currentTime() / sound.duration();
    fill(255);
    rect(x, y, progressBarW * percent, progressBarH, 5);
  }

  fill(255);
  textSize(14);
  text(formatTime(sound.currentTime()), x - 60, y + 12);
  text(formatTime(sound.duration()), x + progressBarW + 15, y + 12);
}

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  let m = floor(sec / 60);
  let s = floor(sec % 60);
  if (s < 10) s = "0" + s;
  return m + ":" + s;
}

// =======================================================
// 버튼 UI
// =======================================================
function drawControlButtons() {
  let playX = width/2 - spacing;
  let stopX = width/2 + spacing;

  fill(230);
  noStroke();

  // PLAY ↔ PAUSE 토글
  if (!sound.isPlaying()) {
    triangle(playX - 8, buttonY - 12, playX - 8, buttonY + 12, playX + 12, buttonY);
  } else {
    rect(playX - 10, buttonY - 12, 6, 24, 3);
    rect(playX + 4,  buttonY - 12, 6, 24, 3);
  }

  // STOP
  rect(stopX - 12, buttonY - 12, 24, 24, 3);
}

// =======================================================
// 클릭 (버튼 + 재생바)
// =======================================================
function mousePressed() {
  // 재생바 클릭 이동
  let progressBarX = width/2 - progressBarW/2;
  let progressBarY = 40;

  if (
    mouseX > progressBarX &&
    mouseX < progressBarX + progressBarW &&
    mouseY > progressBarY - 10 &&
    mouseY < progressBarY + progressBarH + 10
  ) {
    let percent = (mouseX - progressBarX) / progressBarW;
    sound.jump(percent * sound.duration());
    return;
  }

  checkButtons();
}

// =======================================================
function checkButtons() {
  let playX = width/2 - spacing;
  let stopX = width/2 + spacing;

  // PLAY ↔ PAUSE
  if (dist(mouseX, mouseY, playX, buttonY) < 25) {
    if (!sound.isPlaying()) sound.play();
    else sound.pause();
  }

  // STOP (재생바도 0초로 리셋)
  if (dist(mouseX, mouseY, stopX, buttonY) < 25) {
    sound.stop();
    // jump(0)은 필요 없지만 안전하게 초기화
    sound.jump(0);
  }
}
