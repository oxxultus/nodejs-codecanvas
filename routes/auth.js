/*
 * User 정보를 인증하는 라우터
 *
 * 작성자: oxxultus (김영진)
 * 최종 수정자: oxxultus (김영진)
 * 생성일: 2024-11-10
 * 업데이트일: 2024-11-10
*/

/*
 * Node.js 모듈을 불러오는 부분입니다.
 * 사용법: const <변수이름> = require('<모듈이름>');
*/
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/*
* JWT_SECRET 키를 불러오는 부분입니다.
* - .env 파일에 작성되어 있습니다.
* - 사용자 인증과 관련되어 있기 때문에 유출을 금지합니다.
*/
const JWT_SECRET = process.env.JWT_SECRET;

/*
 * express 의 Router() 를 사용하기위해 선언하는 부분입니다.
*/
const router = express.Router();

/*
 * 회원가입을 처리하는 부분입니다.
 * POST 방식으로 /register 로 전달을 했을 때 처리하는 부분입니다.
*/
router.post('/register', async (req, res) => {
  console.log('* register 에서 회원가입 처리를 시도하였습니다.');
  try {
    const { password, email, name, phone, address, gender, birth } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    const newUser = new User({ password, email, name, phone, address, gender, birth });
    await newUser.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    res.status(500).json({ message: '회원가입 실패', error });
  }
});

/*
 * 로그인을 처리하는 부분입니다.
 * POST 방식으로 /login 로 전달을 했을 때 처리합니다.
*/
router.post('/login', async (req, res) => {
  console.log('* login 에서 로그인 처리를 시도하였습니다.');
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: '사용자 이름이 잘못되었습니다.' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: '비밀번호가 잘못되었습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({
      id: user._id
    }, JWT_SECRET, { expiresIn: '1h' });

    // HTTP-Only 쿠키에 토큰 저장 (보안 강화)
    res.cookie('token', token, {
      httpOnly: true,        // 자바스크립트에서 접근 불가
      secure: process.env.NODE_ENV === 'production', // HTTPS 연결에서만 전송
      maxAge: 60 * 60 * 1000 // 1시간 후 만료
    });
    // 쿠키 설정 후 로그 출력
    console.log('* 사용자의 JWT 토큰이 쿠키에 저장되었습니다:\n* 토큰: ', token); // test code

    res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    res.status(500).json({ message: '로그인 실패', error });
  }
});

/*
 * 로그아웃을 처리하는 부분입니다.
 * POST 방식으로 /logout 로 전달을 했을 때 처리하는 부분입니다.
*/
router.post('/logout', (req, res) => {
  // 쿠키에서 토큰 삭제
  res.clearCookie('token');
  res.status(200).json({ message: '로그아웃되었습니다.' });
});

/*
 * 인증 미들웨어 (토큰을 확인하는 라우터입니다.)
*/
function authenticateToken(req, res, next) {
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    console.log('토큰이 없습니다.');
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('유효하지 않은 토큰입니다.', err);
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
}

/*
 * 예시: 라우트 보호 추후 수정할 예정 index.html 에서만 사용
*/
router.get('/protected/index', authenticateToken, async (req, res) => {
  console.log('* index 에서 미들웨어에 접근해서 토큰통한 사용자 인증을 처리했습니다.');
  try {
    // user._id를 통해 데이터베이스에서 사용자 정보 조회
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 페이지마다 받고싶은 정보만 정해서 전달할 수 있도록 한다.
    res.json({
      message: '인증 성공',
      user: {
        id: user._id,
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

/*
 * protected/portfolio 로 보냈을 때 처리하는 부분입니다.
*/
router.get('/protected/portfolio', authenticateToken, async (req, res) => {
  console.log('* portfolio 에서 미들웨어에 접근해서 토큰통한 사용자 인증을 처리했습니다.');
  try {
    // user._id를 통해 데이터베이스에서 사용자 정보 조회
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 페이지마다 받고싶은 정보만 정해서 전달할 수 있도록 한다.
    res.json({
      message: '인증 성공',
      user: {
        name: user.name,
        address: user.address,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error });
  }
});

module.exports = router;
