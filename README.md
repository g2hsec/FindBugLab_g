# 1. 소개

> 이 프로젝트는 웹 보안 실습 및 교육용으로 제작된 플랫폼입니다. 실제 환경과 유사한 다양한 보안 취약점(예: XSS, SQL Injection, Broken Access Control 등)을 포함하고 있으며, 보안 교육, 모의해킹 실습, 포트폴리오 용도로 활용할 수 있습니다. FindBugLab_g은 보안 전문가, 개발자, 학생들이 안전한 환경에서 웹 보안 취약점을 지속적으로 학습하고 실습할 수 있도록 설계되었습니다. 앞으로도 현실적인 최신 공격 시나리오와 실습 환경을 꾸준히 업데이트하여 더욱 풍부한 실습 경험을 제공할 예정입니다.

## 1-1. 주요 목적

- 교육용: 웹 보안 취약점에 대한 이해도 향상
- 실습용: 안전한 환경에서의 모의해킹 연습
- 포트폴리오: 보안 분야 역량 증명
- 연구용: 새로운 보안 기법 테스트 및 검증

# 2. 동작 환경
이 프로젝트는 Node.js 기반으로 작동합니다. 다음 버전 이상이 권장됩니다<br>

```
Node.js ≥ 16.x
npm ≥ 8.x
```
## 2-1 환경설정 및 의존성
1. MySQL 설치 및 설정
2. MySQL 5.7 이상 또는 MariaDB 호환 버전 필요
3. 데이터베이스 및 테이블 생성 (수동생성 필요)

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'admin',
	password: 'admin',
	database: 'g2hsecurity'
});

module.exports = pool.promise();
```

### 2-1-1 MySQL 구조

```sql
// db.js
CREATE DATABASE securelab;

USE securelab;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT,
  content TEXT,
  author VARCHAR(50),
  password VARCHAR(50),
  is_private TINYINT(1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2-1-2 npm 의존성
package.json 파일 기준으로 아래와 같은 패키지가 필요합니다
> npm install express express-session body-parser mysql2 ejs

# 기술 스택
1. Backend: Node.js, Express
2. View Engine: EJS
3. DB: MySQL
4. Frontend: Bootstrap 5
5. 기타: express-session, body-parser

# 3. 설치 및 실행

```shell
# 저장소 클론
git clone https://github.com/g2h/webseclab.git
cd webseclab

# 의존성 설치
npm install

# 개발 서버 실행
npm start
``

# 중요 주의사항
⚠️ 이 플랫폼은 교육 및 실습 목적으로만 사용해야 합니다.<br>
실제 운영 환경에서 사용 금지<br>
악의적인 목적으로의 사용 엄격히 금지<br>
다른 시스템에 대한 무단 침입 시도 금지<br>
로컬 환경 또는 격리된 네트워크에서만 실행 권장<br><br>

# 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.<br>
제작자: g2h<br>
GitHub: @g2h<br>
Email: [g2hsec@gmail.com]<br>
이 플랫폼을 통해 다음과 같은 학습 목표를 달성할 수 있습니다:<br>
- 웹 애플리케이션 보안 취약점의 이해
- 보안 테스팅 기법 습득
- 안전한 코딩 방법론 학습
- 보안 사고 대응 능력 향상

# ⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
