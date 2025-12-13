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

  // 우드 텍스처 (전체 배경 톤)
  for (let i = 0; i < height; i += 6) {
    stroke(100, 80, 55, 30);
    line(0, i, width, i);
  }
  noStroke();

  let waveform = fft.waveform();
  let level = amp.getLevel();

  // 중앙 재생바 위치
  let progressBarX = width/2 - progressBarW/2;
  let progressBarY = 40;

  // 메인 스피커 (빈티지 우드 적용)
  drawMainSpeaker(level);

  // 미니 스피커 (좌우)
  drawMiniSpeaker(width/2 - 220, level);
  drawMiniSpeaker(width/2 + 220, level);

  // LED
  drawLED();

  // 재생바
  drawProgressBar(progressBarX, progressBarY);

  // 버튼들
  drawControlButtons();

  // =========================================
  // 양옆 레벨 바 — 색 변화 강화
  // =========================================
  let barHeight = map(level, 0, 1, 10, 200);

  let barR = map(level, 0, 1, 180, 255);
  let barG = map(level, 0, 1, 140, 60);
  let barB = map(level, 0, 1, 60, 40);
  let barA = map(level, 0, 1, 160, 230);

  fill(barR, barG, barB, barA);
  rect(80, height - barHeight - 60, 35, barHeight, 10);

  fill(barR + 20, barG - 20, barB, barA);
  rect(width - 115, height - barHeight - 60, 35, barHeight, 10);

  // =========================================
  // 하단 파형
  // =========================================
  let waveR = map(level, 0, 1, 200, 255);
  let waveG = map(level, 0, 1, 80, 200);
  let waveB = map(level, 0, 1, 50, 80);
  let waveA = map(level, 0, 1, 150, 255);

  stroke(waveR, waveG, waveB, waveA);
  strokeWeight(2.2);
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
// [★] 메인 스피커 — 완전 빈티지 우드 스피커 스타일
// =======================================================
function drawMainSpeaker(level) {
  let x = width/2 - 150;
  let y = 110;
  let w = 300;
  let h = 300;

  drawWoodBox(x, y, w, h, true);

  let baseX = width / 2;

  let outerColor = color(
    160 + level * 90,
    160 + level * 90,
    160 + level * 130,
    200 + level * 80
  );

  let innerColor = color(
    90 - level * 80,
    90 - level * 80,
    90 - level * 50,
    220 + level * 120
  );

  let unitSize = 70 + level * 30;
  let innerSize = unitSize * (0.45 + level * 0.3);

  for (let i = 0; i < 3; i++) {
    let y = 195 + i * 80;

    fill(outerColor);
    ellipse(baseX, y, unitSize);

    fill(innerColor);
    ellipse(baseX, y, innerSize);
  }

  // 양옆 조작버튼
  fill(130);
  for (let i = 0; i < 5; i++) {
    ellipse(width/2 - 120, 160 + i * 50, 12);
    ellipse(width/2 + 120, 160 + i * 50, 12);
  }
}

// =======================================================
// [★] 미니 우드 스피커
// =======================================================
function drawMiniSpeaker(centerX, level) {
  drawWoodBox(centerX - 45, 240, 90, 170, false);

  let outerColor = color(
    160 + level * 90,
    160 + level * 90,
    160 + level * 130,
    180 + level * 90
  );

  let innerColor = color(
    90 - level * 80,
    90 - level * 80,
    90 - level * 60,
    220 + level * 110
  );

  let unitSize = 35 + level * 18;
  let innerSize = unitSize * (0.45 + level * 0.3);

  let y1 = 290;
  let y2 = 360;

  fill(outerColor);
  ellipse(centerX, y1, unitSize);
  fill(innerColor);
  ellipse(centerX, y1, innerSize);

  fill(outerColor);
  ellipse(centerX, y2, unitSize);
  fill(innerColor);
  ellipse(centerX, y2, innerSize);
}

// =======================================================
// [★ 핵심] 우드 스피커 박스 렌더링 함수
// =======================================================
function drawWoodBox(x, y, w, h, isMain) {
  noStroke();

  // 나무 결 텍스처 그라데이션
  for (let i = 0; i < h; i++) {
    let c = lerpColor(
      color(130, 80, 40),
      color(90, 55, 25),
      i / h
    );
    fill(c);
    rect(x, y + i, w, 1);
  }

  // 깊은 프레임(어두운 나무)
  stroke(40, 20, 10);
  strokeWeight(isMain ? 7 : 5);
  noFill();
  rect(x, y, w, h, isMain ? 20 : 12);

  // 랜덤 목재 무늬
  for (let i = 0; i < 90; i++) {
    let px = x + random(w);
    let py = y + random(h);
    stroke(60, 35, 10, 70);
    point(px, py);
  }

  // 가로결 (wood grain 라인)
  for (let i = 0; i < h; i += 12) {
    stroke(150, 110, 70, 40);
    line(x + 5, y + i, x + w - 5, y + i);
  }
}

// =======================================================
// LED
// =======================================================
function drawLED() {
  let ctx = drawingContext;

  ctx.shadowBlur = 12;
  ctx.shadowColor = sound.isPlaying()
    ? "rgba(0,255,80,0.9)"
    : "rgba(255,50,50,0.9)";

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

  if (!sound.isPlaying()) {
    triangle(playX - 8, buttonY - 12, playX - 8, buttonY + 12, playX + 12, buttonY);
  } else {
    rect(playX - 10, buttonY - 12, 6, 24, 3);
    rect(playX + 4,  buttonY - 12, 6, 24, 3);
  }

  rect(stopX - 12, buttonY - 12, 24, 24, 3);
}

// =======================================================
// 클릭
// =======================================================
function mousePressed() {
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

  if (dist(mouseX, mouseY, playX, buttonY) < 25) {
    if (!sound.isPlaying()) sound.play();
    else sound.pause();
  }

  if (dist(mouseX, mouseY, stopX, buttonY) < 25) {
    sound.stop();
    sound.jump(0);
  }
}




