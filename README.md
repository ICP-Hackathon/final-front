#### 2024.09.09 UPDATE

1. 기존에 각 tsx에 있었던 intefacte.ts를 utils/interface.ts로 모음
2. API Base URL을 .env에서 관리
3. IOS View Port -100px update 적용 (실험 아직 X)

#### 2024.09.10 13:31 UPDATE

1. 검색 기능 구현
2. React-Item-Carousel로 무한 carousel 구현
3. Make시 한 페이지 안에 들어오게끔 수정

### 2024.09.11 UPDATE

1. AI list grid 수정
2. Settings Page에서 Load Image Error 수정
3. Settings Page에서 AIprofiles -> Component MyAIs로 수정
4. Chat Routing 시 Chat ID로 가는 것 -> AiID로 가도록 수정
5. Backend에서 Chat Not Found, Chat Contents Not Found 안나오게 수정. 대신 빈 배열 반환 -> API 수정 필요
6. declaration 추가, 로그인 오류 해결, settings page api 수정 필요