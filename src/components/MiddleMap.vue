<template >
    <label class="container">
        <div id="map" class="mapArea"></div>
        <input type="checkbox">
        <div class="toggle">
            <span class="top_line common"></span>
            <span class="middle_line common"></span>
            <span class="bottom_line common"></span>
        </div>
        <div class="slide">
            <h1>MENU</h1>
            <ul>
                <li><a href="#"><i class="fas fa-tv"></i>dashboard</a></li>
                <li><a href="#"><i class="far fa-user"></i>profile</a></li>
                <li><a href="#"><i class="fab fa-gripfire"></i>trending</a></li>
                <li><a href="#"><i class="far fa-comments"></i>messages</a></li>
                <li><a href="#"><i class="far fa-folder"></i>file manager</a></li>
                <li><a href="#"><i class="far fa-address-book"></i>protfolio</a></li>
                <li><a href="#"><i class="far fa-heart"></i>saved</a></li>
                <li><a href="#"><i class="fas fa-cogs"></i>settings</a></li>
            </ul>
        </div>
    </label>
</template>
<script>
export default {
    name: "KakaoMap",
    data() {
        return {
            map: null,

            // 카테고리 선택시 색변경을 하기위한 변수
            category_click: {
                food:false,
                cafe:false,
                pension: false,
                paking: false,
                coupon: false,
                order: false,
            }
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
        },

        moveListPage() {
            this.$router.push({ name: "ListPage", params: {} });
        },

        moveMainPage() {
            this.$router.push({ name: "MainPage", params: {} });
        },
        /* 카테고리 클릭시 */
        btnClick(menu) {
            console.log('btnClick')
            const vm = this;
            vm.category_click={
                food:false,
                cafe:false,
                pension: false,
                paking: false,
                coupon: false,
                order: false,
            }
            vm.category_click[menu] = true;
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
@import "/src/css/MiddleMap.css";
</style>
