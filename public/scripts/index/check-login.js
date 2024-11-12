// 이벤트 핸들러의 중복 등록 확인을 위한 코드
function checkAuthStatus() {
  const authCheckExecuted = document.body.dataset.authCheckExecuted;
  if (authCheckExecuted) return;

  document.body.dataset.authCheckExecuted = "true";

  fetch('/api/auth/protected/index', {
    method: 'GET',
    credentials: 'include' // 쿠키를 함께 전송하도록 설정
  })
    .then(async response => {
      if (response.ok) {
        const data = await response.json(); // id 값을 가지고 데이터를 검색하여 찾아서 반환한다.
        document.getElementById("logout-button").style.display = "inline-block";
        alert(`환영합니다, ${data.user.id}님!`); // test-code
      } else {
        alert("로그인을 진행하시면 여러가지 기능을 사용할 수 있습니다.");
      }
    })
    .catch(error => {
      console.error('오류 발생:', error);
      window.location.href = '/index.html';
    });
}

window.onload = () => {
  checkAuthStatus();
};