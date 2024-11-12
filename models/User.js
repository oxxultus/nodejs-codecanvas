/*
 * User 데이터베이스
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
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/*
* Schema 에  mongoose.Schema 를 할당하여 재사용성을 높였습니다.
*/
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  /*
   * 유저(사용자) 정보를 저장하기 위한 테이블
   * 사용: /register, /login
   * 속성: 
   * - type: 속성의 타입을 설정합니다
   * - required: 필수로 받아야 하는 값인지 설정합니다.
   * - unique: 고유한 값인지 설정합니다. (중복된 이메일을 사용하지 못하게 하기 위함입니다.)
  */
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  birth: { type: String },

  /*
   * 유저(사용자)의 개인 포트폴리오 페이지를 작성하기 위한 테이블
   * 사용: /portfolio/set
  */
  // 이미지 저장 링크
  profile_image: { type: String, default: "default" },
  // social 종류 저장
  social_link_first: { type: String, default: "default"},
  social_link_second: { type: String, default: "default"},
  social_link_third: { type: String, default: "default"},
  social_link_fourth: { type: String, default: "default"},
  // stack 종류 저장
  stack_link_first: { type: String, default: "default"},
  stack_link_second: { type: String, default: "default"},
  stack_link_third: { type: String, default: "default"},
  stack_link_fourth: { type: String, default: "default"},
  stack_link_fifth: { type: String, default: "default"},
  stack_link_sixth: { type: String, default: "default"},
  // certificate 종류 저장
  certificate_link_first: { type: String, default: "default"},
  certificate_link_second: { type: String, default: "default"},
  certificate_link_third: { type: String, default: "default"},
  certificate_link_fourth: { type: String, default: "default"},
  // portfolio 이미지에 대한 주소 저장
  portfolio: { // String 타입의 배열
    type: [String],
    default: ['https://example1.com', 'https://example2.com'], // 기본값 설정
  },
  // portfolio 이미지에 대한 주소와 해당하는 설명을 저장
  project: {
    type: [[String]], // 2차원 문자열 배열
    // 해당 행은 project[0][0], project[0][1] 로 연산가능하다.
    default: [['https://example1.com', 'this project is so hard to write']],  // 기본값 설정
  }

},{timestamps: true});

// 비밀번호 해쉬화
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 비밀번호 비교 메서드
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;