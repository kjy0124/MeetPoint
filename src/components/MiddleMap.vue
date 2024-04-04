<template>
    <label class="container">
        <div id="map"></div>
        <input class="hamburger" type="checkbox">
        <div class="toggle">
            <span class="top_line common"></span>
            <span class="middle_line common"></span>
            <span class="bottom_line common"></span>
        </div>
        <div class="slide">
            <h1>MENU</h1>
            <ul>
                <li><a href="#"><input type="checkbox"><i class="fas fa-tv"></i>dashboard</a></li>
                <li><a href="#"><input type="checkbox"><i class="far fa-user"></i>profile</a></li>
                <li><a href="#"><input type="checkbox"><i class="fab fa-gripfire"></i>trending</a></li>
                <li><a href="#"><input type="checkbox"><i class="far fa-comments"></i>messages</a></li>
                <li><a href="#"><input type="checkbox"><i class="far fa-folder"></i>file manager</a></li>
                <li><a href="#"><input type="checkbox"><i class="far fa-address-book"></i>protfolio</a></li>
                <li><a href="#"><input type="checkbox"><i class="far fa-heart"></i>saved</a></li>
                <li><a href="#"><input type="checkbox"><i class="fas fa-cogs"></i>settings</a></li>
            </ul>
        </div>
        <div class="toggle_btm">
            일정만들기
        </div>
    </label>
</template>
<script>
export default {
    name: "MiddleMap",
    data() {
        return {

        }
    },
    methods: {
        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 5,
            };

            //지도 객체를 등록합니다.
            //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
            this.map = new kakao.maps.Map(container, options);
        },
    },
    created() {

    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement("script");
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap);
            script.src =
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=915cffed372954b7b44804ed422b9cf0";
            document.head.appendChild(script);
        }
    },

}
</script>

<style scoped>
#map {
    z-index: 3;
    width: 100%;
    height: 100%;
}

body {
    background-color: #f2f2f2;
}

.container {
    display: flex;
}

#map{
    z-index: 0;
}

.mapArea {
    height: 100%;
    width: 100%;
    background-color: #fff;
    font-size: 100px;
    /* 지도 에러 해결되면 삭제 */
}

.slide {
    height: 100%;
    width: 400px;
    position: absolute;
    background-color: #fff;
    transition: 0.5s ease;
    transform: translateX(-400px);
    text-align: left;
    padding-left: 2em;
}

h1 {
    color: #5271ff;
    font-weight: 800;
    text-align: right;
    padding: 10px 0;
    padding-right: 30px;
    pointer-events: none;
}

ul li a {
    color: #011a41;
    font-weight: 500;
    padding: 5px 0;
    display: block;
    text-transform: capitalize;
    text-decoration: none;
    transition: 0.2s ease-out;
}

ul li:hover a {
    color: #fff;
    background-color: #5271ff;
}

ul li a i {
    width: 40px;
    text-align: center;
}

.hamburger {
    display: none;
    visibility: hidden;
    -webkit-appearance: none;
}

.toggle {
    position: absolute;
    height: 30px;
    width: 30px;
    top: 20px;
    left: 15px;
    z-index: 1;
    cursor: pointer;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.toggle_btm {
    position: absolute;
    height: 60px;
    width: 90px;
    top: 85%;
    left: 15px;
    z-index: 1;
    cursor: pointer;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.toggle .common {
    position: absolute;
    height: 2px;
    width: 20px;
    background-color: #5271ff;
    border-radius: 50px;
    transition: 0.3s ease;
}

.toggle .top_line {
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.toggle .middle_line {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.toggle .bottom_line {
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.hamburger:checked~.toggle .top_line {
    left: 2px;
    top: 14px;
    width: 25px;
    transform: rotate(45deg);
}

.hamburger:checked~.toggle .bottom_line {
    left: 2px;
    top: 14px;
    width: 25px;
    transform: rotate(-45deg);
}

.hamburger:checked~.toggle .middle_line {
    opacity: 0;
    transform: translateX(20px);
}

.hamburger:checked~.slide {
    transform: translateX(0);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}
</style>
