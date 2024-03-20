<template>
  <div class="container" >
    <div class="list" >
        <div class="logo" >Meet Point</div>
        <div class="info">중간지점 정보</div>
        <div class="btn">
            <button>일정 만들기 ></button>
        </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>

export default {
    name: "KakaoMap",
    data() {
        return {
            map: null,
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById('map');
            const options = {
              center: new window.kakao.maps.LatLng(35.9123, 128.8077),
              level: 3,
              
            };

            this.map = new window.kakao.maps.Map(container, options);
        }
    },
    created() {
        
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement('script');
            
            script.onload = () => window.kakao.maps.load(this.initMap);
            script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8';
            document.head.appendChild(script);
        }
    },
    
}
</script>

<style>
.container {
    display: flex;
    align-items: center;
    height: 100vh;
}

.list {
    position: relative;
    width: 30%;
    height: 99.5%;
}

.list .logo {
    height: 10%;
    font-size: 60px;
    text-align: center;
    font-family: "Eczar", serif;
    font-optical-sizing: auto;
    font-weight: 400px;
    font-style: normal;
    border-bottom: 1px solid black;
}

.list .info {
    height: 80%;
    /* border-bottom: 1px solid black; */
}

.list .btn{
    height: 10%;
    display: flex;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    
}

.btn button {
    width: 80%;
    height: 80%;
    background-color: #0a0a23; /* 버튼 배경색 */
    color: #fff; /* 버튼 텍스트 색상 */
    border: none;
    border-radius: 25px;
    font-size: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.list button:hover {
    background-color: #002ead; /* 마우스 호버 시 버튼 배경색 변경 */
    transition: 0.7s;
}

#map{
    width: 70%;
    height: 100%;
}

</style>