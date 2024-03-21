<template>
  <div class="main">
    <img
      class="background-image"
      alt="background"
      src="@/assets/background.png"
    />
    <div class="rounded-box">
      <div class="main-box">
        <h1>Meet Point</h1>
        <h3 style="color: lightgray">
          이름과 위치를 입력하고 원하는 방식으로 중간지점을 검색하세요!
        </h3>
        <div class="info-box">
          <section style="padding: 0px; margin: auto; width: 30%;">
            <div>
              <input class="input-text" placeholder="이름을 입력하세요!" type="text" v-model="name"/>
            </div>
            <div style="height: 30px;"></div>
            <div class="searchWrap">
              <input class="search-input-text" placeholder="위치를 입력하세요!" type="text" v-model="location" @click="modalopen()"/>
              <!-- <button class="searchBtn"></button> -->
              <img src="../assets/돋보기.png" >
            </div>
          </section>
          <section style="width: 25%;" class="playbuttonsec"><input class="playbutton" type="button"/></section>
          <section style="padding: 0; margin: 10px; width: 40%;">
            <table class="list-table">
              <thead >
                <tr>
                  <th>이름</th>
                  <th>위치</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>홍길동</td>
                  <td>부산광역시 해운대구 센텀1로 9</td>
                  <td class="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>김철수</td>
                  <td>전주시 완산구 흑석로 2</td>
                  <td class="btn2">
                    <svg @click="Delete()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg> 
                  </td>
                </tr>
                <tr>
                  <td>박영희</td>
                  <td>속초시 논산길 5</td>
                  <td class="btn3">
                    <img class="black-x-btn" src="../assets/x-circle-fill.svg" />
                  </td>
                </tr>
                <tr>
                  <td></td><td></td><td></td>
                </tr>
                <tr>
                  <td></td><td></td><td></td>
                </tr>
                <tr>
                  <td></td><td></td><td></td>
                </tr>
              </tbody>
            </table>
            <button class="works_button" @click="move()">중간지점 찾기</button>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "MainPage",
    data() {
      return {

      }
    },
    methods :{

      /* 중간지점 찾기 버튼 클릭시 두번째 페이지로 이동 */
      move(){
        this.$router.push( { name: "KakaoMap", params: {} } ); // router.push( {path : '/KakaoMap.page', query: {} });
      },

      //위치 input box 클릭 시 모달 창 열기
      modalopen(){

      },

      /* 삭제 버튼 */ 
      Delete() {
        alert("삭제");
      },

    },

    created() {

    },
    mounted() {

    }
}
</script>

<style>
.main {
  width: 100%;
  height: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.rounded-box {
  width: 65%;
  height: 85%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 7%;
  left: 17%;
  z-index: 2;
}

.main-box {
  width: 98%;
  height: 97%;
  background-color: white;
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  position: absolute;
  z-index: 3;
}

.info-box {
  width: 90%;
  height: 70%;
  background: linear-gradient(to right, #cdffd8 30%, #94b9ff);
  border-radius: 1%;
  z-index: 4;
  display: flex;
  padding: 0;
}

.playbutton{
  background: url("../assets/재생버튼.png") no-repeat;
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-width: 0;
}

/* 이름 입력하는 부분 */
.input-text{
  border-width: 0;
  height: 30px;
  font-size: 20px;
  width: 93%;
  border-radius: 5px;
  padding: 1px 35px 1px 5px;
}

/* 위치 입력하는 부분 */
.searchWrap {
    position: relative;
    width: 93%;
}
/* 위치 입력하는 부분 */
.search-input-text {
  border-width: 0;
  height: 30px;
  font-size: 20px;
  width: 100%;
  border-radius: 5px;
  padding: 1px 35px 1px 5px;
}
/* 위치 입력하는 돋보기 부분 */
.searchWrap img {
  position: absolute;
  top: 0;
  right: -35px;
  width: 30px;
  height: 30px;
  background: url(../assets/돋보기.png);
  border: none;
  outline: none;
  cursor: pointer;
}

.list-table{
  border-bottom: 2px solid #7a97f7;
  border-collapse: collapse;
  width: 100%;
  height: 60%;
  margin: 20px 0;
}

.list-table th,
.list-table td{
  text-align: center;
}

.list-table th,
.list-table td{
  border-top: 2px solid #7a97f7;
  border-collapse : collapse;
}

.list-table thead th{
  background-color: #dbe3fb;
  color: #213f99;
}

.list-table td:empty {
  visibility: hidden; /* 빈 셀의 내용을 숨김 */
}

.list-table td:empty::before {
  content: "\00a0"; /* 빈 셀에 내용이 없을 때 공간 유지 */
}

.playbuttonsec{
  padding: 0; display: flex;
  justify-content: center;
  align-items: center;
}

.works_button {
  display: inline-block;
  width: 100%;
  height: 55px !important; 
  border: none;
  border-radius: 5px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  background: linear-gradient(to left, #6164c4, #36b2cd) !important;
  position: relative;
  overflow: hidden;
  margin-top: 50px;
}

.works_button::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.2), transparent) p !important;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.works_button:hover::before {
  transform: translateY(0);
}
  
.works_button:hover {
  background: linear-gradient(to left, #36b2cd, #6164c4) !important;
}

/* 삭제 x 이미지 */
img{
  width: 16px;
  height: 16px;
}

/* 흰색 x 이미지 */
.btn svg:hover {
  transition: background-color 0.5s ease;
  fill: #fff;
}
/* 검은색 x 이미지 */
.btn2 svg:hover {
  transition: background-color 0.5s ease;
  fill: #fff;
  animation-fill-mode: backwards;
}

</style>