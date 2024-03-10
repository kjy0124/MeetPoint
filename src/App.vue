<template>
  <div class="main">
    <img class="background-image" alt="background" src="./assets/background.png">
    <div class="rounded-box">
      <div class="main-box">
        <h1>Meet Point</h1>
        <h3 style="color: lightgray;">이름과 위치를 입력하고 원하는 방식으로 중간지점을 검색하세요!</h3>
        <div class="info-box">
          <section>s</section>
          <section>d</section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {

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

.info-box{
  width: 90%;
  height: 70%;
  background: linear-gradient(to right, #cdffd8 30%, #94b9ff);
  border-radius: 1%;
  z-index: 4;
  display: flex;
}

</style>
