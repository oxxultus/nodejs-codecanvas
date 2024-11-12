/*
 * Node.js express 를 사용하여 서버를 구현하는 부분입니다.
 *
 * 작성자: oxxultus (김영진)
 * 최종 수정자: oxxultus (김영진)
 * 생성일: 2024-11-10
 * 업데이트일: 2024-11-10
*/

//==============================================================================

/*
 * Node.js 라이브러리 모듈 및 사용자 설정 모듈을 불러오는 부분입니다.
 * 사용법: const <변수이름> = require('<모듈이름>');
*/
// 라이브러리 모듈
const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const cors = require('cors');

const path = require('path');

require('dotenv').config();

// 사용자 설정 모듈
const authRoutes = require('./routes/auth');

//==============================================================================

// Express 애플리케이션 생성
const app = express();


// 정적 파일 제공
// '/public' 폴더 내의 파일들을 정적 파일로 제공
app.use(express.static(path.join(__dirname, 'public')));

//==============================================================================

// mongoDB 연결하는 부분
const mongoURI = process.env.MONGODB_LOCAL;
mongoose.connect(mongoURI).then(() => console.log("* mongoose 를 통한 DB 연결에 성공하였습니다.")).catch(err => console.log(err));

//==============================================================================

// 서버 포트 설정
const port = 3000;

//==============================================================================

// JSON 형식의 요청 본문을 파싱하기 위해 express 모듈의 JSON 미들웨어를 사용합니다.
app.use(express.json());

// 쿠키를 파싱하기 위함 (졸라 중요함)
app.use(cookieParser());

// CORS(Cross-Origin Resource Sharing) 미들웨어를 사용하여 모든 도메인에서의 요청을 허용합니다.
app.use(cors());

// body-parser 미들웨어를 설정하여 application/x-www-form-urlencoded 파싱을 비활성화(false)하는 설정을 추가합니다.
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser 미들웨어를 설정하여 JSON 형식의 요청 본문(body)을 파싱하도록 설정합니다.
app.use(bodyParser.json());

// '/api/auth' 경로로 들어오는 요청을 처리하기 위해 authRoutes 라우터를 사용합니다.
app.use('/api/auth', authRoutes);

//==============================================================================

// 링크로 들어온 경우에 따라 파일을 응답으로 보내준다.

// 루트 경로 ('/')로 들어오는 GET 요청에 대해 'index.html' 파일을 응답으로 보냅니다.
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/view/index.html'));
});

// '/index.html' 경로로 들어오는 GET 요청에 대해 'index.html' 파일을 응답으로 보냅니다.
app.get('/index.html', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', '/view/index.html'));
});

// '/portfolio.html' 경로로 들어오는 GET 요청에 대해 'portfolio.html' 파일을 응답으로 보냅니다.
app.get('/portfolio.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/view/portfolio.html'));
});


//==============================================================================
// 서버 시작 및 포트 리스닝
// 서버를 지정된 포트에서 시작하고 콘솔에 메시지를 출력
app.listen(port, () => {
  console.log(`=========================================`);
  console.log(`* Code Canvas 웹 서버가 실행 되었습니다.`);
  console.log(`* 주소: http://localhost:${port}/`);
  console.log(`* 포트: ${port}`);
  console.log(`=========================================`);
});

//==============================================================================

