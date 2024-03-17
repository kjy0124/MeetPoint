<template>
  <div>
    <div id="map">

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
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
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
    height: 500px;
}
</style>