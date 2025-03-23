# MeetPoint

## 프로젝트 이름

MeetPoint

## YSY팀
- **권지용(팀장)**: UI/UX 디자인 & 프론트엔드 개발
- **김종엽(팀원)**: kakao API 담당 & 백엔드 개발
- **김준식(팀원)**: 백엔드 개발 & 프론트엔드 개발

## 소개 (Overview)

MeetPoint는 여러 사용자의 위치 데이터를 기반으로 가장 적절한 중간 지점을 계산하여 만남의 장소를 추천하는 서비스입니다. 사용자는 다양한 추천 방식 중 원하는 방법을 선택하여 최적의 만남 장소를 찾을 수 있으며, 일정 관리 및 공유 기능도 제공합니다.

## 기능 (Features)

- **중간 지점 계산**: 거리순, 무게 중심, 교통 점수 기반 중간 지점 추천
![Image](https://github.com/user-attachments/assets/63447856-387c-400e-99bf-fffac5202f70)

- **사용자 맞춤형 장소 선택**: 계산된 중간 지점을 기준으로 사용자가 선호하는 장소를 직접 선택
![Image](https://github.com/user-attachments/assets/4fd22255-10ca-45b6-b5ec-60282b4ccb84)

- **일정 관리 및 공유**: 최적 만남 시간 및 장소를 설정하고 공유
![Image](https://github.com/user-attachments/assets/e50afc9d-7c35-4519-a725-194943f65a3d)

- **KAKAO API 활용**: 지도 및 장소 검색 기능 지원

## 설치 방법 (Installation)

### 필수 환경 (Prerequisites)
MeetPoint를 실행하기 위해 아래 환경이 필요합니다.

**Java 17** <br/>
**Vue 3.2.13**

### 1. 프론트엔드 (Vue.js)

```bash
# 프로젝트 클론
git clone https://github.com/your-repo/meetpoint.git
git checkout front-end

# 패키지 설치
npm install

# 개발 서버 실행
npm run serve
```

### 2. 백엔드 (Spring Boot)

```bash
# 프로젝트 클론
git clone https://github.com/your-repo/meetpoint.git
git checkout back-end

# Gradle 빌드 (또는 Maven 사용 가능)
./gradlew build

# 애플리케이션 실행
MeetpointApplication.java 실행
```

## 사용 방법 (Usage)

1. **사용자 위치 입력**: 이름과 위치를 입력한 후 중간 지점 계산 방식 선택
2. **중간 지점 추천**: 계산된 중간 지점을 기준으로 최적의 만남 위치 및 방문하고 싶은 장소 선택
3. **일정 생성 및 공유**: 선택한 장소를 기반으로 일정 생성 및 공유

## 기술 스택 (Tech Stack)

- **프론트엔드**: Vue.js
- **백엔드**: Spring Boot
- **데이터베이스**: PostgreSQL
- **API**: KAKAO API (지도, 장소 검색, 위치 등)
- **기타**: cloudtype(배포)

## 브랜치 구조 (Branch Structure)
- `front-end`: Vue.js 기반의 프론트엔드 코드 저장소
- `back-end`: Spring Boot 기반의 백엔드 코드 저장소

## 폴더 구조 (Directory Structure)
프론트엔드와 백엔드는 각각 front-end, back-end 브랜치에서 관리됩니다.  
아래는 각 브랜치 내 폴더 구조입니다.

### `front-end` 브랜치
```
meetpoint/ # Vue.js 프론트엔드
├── public/               
├── src/
│   ├── assets/         # 정적 파일 (이미지, svg파일)
│   ├── components/     # 페이지별 화면 구성
│   ├── css/            # css 파일
│   └── router/         # 라우팅 설정
```

### `back-end` 브랜치
```
meetpoint/ # Spring Boot 백엔드
├── src/main/
│   ├── java/MeetPoint/meetpoint/          # Java 소스 코드
│   │                  ├── config          # 프로젝트 전반의 설정을 담당 (WebConfig)
│   │                  └── Map             # 중간 지점 계산 및 지도 관련 기능을 처리
│   │                      ├── algorithm   # 중간 지점 계산 알고리즘 구현 (거리순, 그레이엄 스캔 알고리즘, 교통 점수순)
│   │                      ├── controller  #HTTP 요청을 처리하는 컨트롤러 계층
│   │                      ├── dao         # DB와의 연결을 담당하는 데이터 접근 계층
│   │                      └── service     # 주요 비즈니스 로직을 처리하는 서비스 계층
│   │
│   ├── resources/          # 설정 파일 및 정적 리소스
│   │   ├── application.yml # Spring Boot 애플리케이션 설정 파일
│   │   └── mybatis/mapper  # MyBatis 매퍼 XML 파일 저장
```

---


