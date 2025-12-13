// ===== 변수 =====
let sound;
let fft;
let amp;

let progressBarX = 150;
let progressBarY = 40;
let progressBarW = 500;
let progressBarH = 15;

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
  rect(width/2 - 170, 70, 340, 360, 25);
  noStroke();

  // -------------------------------
  // LED 불빛 (Glow 효과)
  // -------------------------------
  let ctx = drawingContext;
  ctx.shadowBlur = 18;
  ctx.shadowColor = sound.isPlaying() ? "rgba(0,255,80,0.9)" : "rgba(255,60,60,0.9)";
  fill(sound.isPlaying() ? color(0, 255, 80) : color(255, 60, 60));
  ellipse(width/2, 95, 16);  // 크기 줄임
  ctx.shadowBlur = 0; // 이후 도형에 영향 없도록 초기화

  // -------------------------------
  // 3개의 스피커 유닛 (간격 넓힘)
  // -------------------------------
  let baseX = width / 2;
  let unitSize = 80 + level * 20;

  fill(160);
  ellipse(baseX, 160, unitSize);
  ellipse(baseX, 260, unitSize);
  ellipse(baseX, 360, unitSize);

  // -------------------------------
  // 양옆 버튼 (장식)
  // -------------------------------
  fill(120);
  for (let i = 0; i < 5; i++) {
    ellipse(width/2 - 150, 130 + i * 65, 14);
    ellipse(width/2 + 150, 130 + i * 65, 14);
  }

  // -------------------------------
  // 음악 재생 바 (Progress Bar)
  // -------------------------------
  drawProgressBar();

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

// =======================================================
// 재생 바 UI
// =======================================================
function drawProgressBar() {
  fill(200);
  rect(progressBarX, progressBarY, progressBarW, progressBarH, 5);

  if (sound.duration() > 0) {
    let percent = sound.currentTime() / sound.duration();
    fill(100, 200, 255);
    rect(progressBarX, progressBarY, progressBarW * percent, progressBarH, 5);
  }

  // 현재 시각 / 전체 길이
  fill(255);

  let current = formatTime(sound.currentTime());
  let total = formatTime(sound.duration());

  textSize(14);
  text(current, progressBarX - 60, progressBarY + 12);
  text(total, progressBarX + progressBarW + 15, progressBarY + 12);
}

// =======================================================
// 시간 표시 mm:ss
// =======================================================
function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  let m = floor(sec / 60);
  let s = floor(sec % 60);
  if (s < 10) s = "0" + s;
  return m + ":" + s;
}

// =======================================================
// 재생 바 클릭으로 위치 이동
// =======================================================
function mousePressed() {
  // 재생 바 클릭했을 때
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

  // 클릭 시 처음 시작
  if (!sound.isPlaying()) {
    sound.play();
  }
}
