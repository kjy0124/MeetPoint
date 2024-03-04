<template>
  <img alt="Vue logo" src="./assets/background.png">
  <div class="rounded-box"></div>
</template>

<script>
export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.background-image {
  width: 100%;
  height: auto;
  position: absolute; /* 이미지를 절대적으로 설정 */
  top: 0;
  left: 0;
  z-index: 1; /* 이미지를 맨 위로 올리기 */
}

.rounded-box {
  width: 500px;
  height: 500px;
  background-color: rgba(169, 169, 169, 0.5);
  border-radius: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: absolute; /* 박스를 절대적으로 설정 */
  top: 50px; /* 원하는 위치로 조절 */
  left: 50px; /* 원하는 위치로 조절 */
  z-index: 2; /* 박스를 이미지 위로 올리기 */
}
</style>
