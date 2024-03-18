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
          <section style="padding: 20px;">
            <div>
              <input placeholder="이름을 입력하세요!" type="text" v-model="name"/>
            </div>
            <div>
              <input placeholder="위치를 입력하세요!" type="text" v-model="location" @click="alert('dd')"/>
              <button><img src="@/assets/돋보기.png" /></button>
            </div>
          </section>
          <section style="padding: 20px;"><button>▶</button></section>
          <section style="padding: 20px;">
            <table border="1">
              <thead>
                <tr>
                  <th>이름</th><th>위치</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>홍길동</td><td>부산광역시 해운대구 센텀1로 9</td>
                </tr>
                <tr>
                  <td>김철수</td><td>전주시 완산구 흑석로 2</td>
                </tr>
                <tr>
                  <td>박영희</td><td>속초시 논산길 5</td>
                </tr>
                <tr>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td></td><td></td>
                </tr>
              </tbody>
            </table>
            <button @click="move()">중간지점 찾기</button>
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
      }
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
}
</style>