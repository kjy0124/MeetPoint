<template>
  <div style="display: flex; align-items: center;">
    <sidebar style="width: 30%; position: relative; height: 100%;">
        <div style="height: 20%;">Meet Point</div>
        <info style="height: 60%;">중간지점 정보</info>
        <div style="height: 20%;">
            <button>일정 만들기 ></button>
        </div>
    </sidebar>
    <div id="map" style="width: 70%;">
    </div>
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
#map{
    width: 100%;
    height: 100vh;
}
</style>