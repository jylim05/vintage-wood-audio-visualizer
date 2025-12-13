// ===== 변수 선언 =====
let sound;
let fft;
let amp;

// 색상 모드 전환용 변수
let colorModeIndex = 0; 

function preload() {
  // 음악 파일 불러오기
  sound = loadSound("music.mp3");
}

function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);

  // ===== 주파수 분석 객체 생성 (필수) =====
  fft = new p5.FFT();
  amp = new p5.Amplitude();
}

function draw() {
  background(10);

  // ===== 오디오 데이터 분석 =====
  let waveform = fft.waveform();   // 파형 데이터
  let level = amp.getLevel();      // 음량 데이터 (0~1)

  // ===== 시각 변수에 매핑 (크기 + 색상 + 회전) =====
  let size = map(level, 0, 1, 50, 300); // 원 크기 매핑
  let rot = map(level, 0, 1, 0, 360);   // 회전값 매핑
  let col = map(level, 0, 1, 50, 255);  // 색 밝기 매핑

  push();
  translate(width / 2, height / 2);
  rotate(rot); // 회전 적용

  // ===== 색상 모드 전환 (사용자 인터랙션) =====
  if (colorModeIndex === 0) {
    fill(col, 100, 255);
  } else if (colorModeIndex === 1) {
    fill(255, col, 100);
  } else {
    fill(100, 255, col);
  }

  // ===== 도형 1: 원(ellipse) =====
  noStroke();
  ellipse(0, 0, size);

  pop();

  // ===== 도형 2: 파형을 이용한 ‘선(line)’ 그리기 =====
  stroke(150, col, 255);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    let index = floor(map(i, 0, width, 0, waveform.length));
    let y = map(waveform[index], -1, 1, -50, 50);
    vertex(i, height - 100 + y);
  }
  endShape();

  // ===== 도형 3: rect를 이용한 바(Bar) 시각화 =====
  let barHeight = map(level, 0, 1, 10, 300);
  fill(255, 150, col, 150);
  rect(50, height - barHeight - 20, 30, barHeight);
}

// ===== 사용자 인터랙션 =====

// 1) 클릭하면 재생/정지 (필수 항목 충족)
function mousePressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}

// 2) 키보드로 색상 모드 변경 (필수 항목 충족)
function keyPressed() {
  colorModeIndex = (colorModeIndex + 1) % 3;
}

