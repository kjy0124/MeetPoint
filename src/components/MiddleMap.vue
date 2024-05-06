<template>
    <header class="header">
        <div><img src="@/assets/caret-modal-fill.svg" alt="뒤로가기" @click="moveBack()" /></div>
        <span class="top-title">중간지점 결과</span>
    </header>
    <div class="container">
        <div class="map-wrap">
            <div id="map"></div>
            <div id="reSearch"></div>
        </div>
        <input class="hamburger" type="checkbox" id="eachforid">
        <label class="toggle" for="eachforid">
            <span class="top_line common"></span>
            <span class="middle_line common"></span>
            <span class="bottom_line common"></span>
        </label>
        <div class="slide">
            <h1>Meet Point</h1>
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
            <div class="toggle_btm" @click="moveListPage()">
                일정만들기
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "MiddleMap",
    data() {
        return {
            mpLatitude: "", // 중간좌표 위도
            mpLongitude: "" // 중간좌표 경도
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById("map");
            // const containerr = document.getElementById("reSearch");
            const options = {
                center: new kakao.maps.LatLng(this.mpLatitude, this.mpLongitude), //33.450701, 126.570667
                level: 5,
            };
            //지도 객체를 등록합니다.
            //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
            this.map = new kakao.maps.Map(container, options);
        },

        moveListPage() {
            this.$router.push({ name: "ListPage", params: {} });
        },

        moveBack() {
            this.$router.push({ path: "/", query: {} });
            this.$router.go(-1);
        },
    },

    created() {

    },
    mounted() {
        this.mpLatitude = this.$route.query.mpLatitude; // 첫 번째페이지에서 라우터로 전달해준 위도값
        this.mpLongitude = this.$route.query.mpLongitude; // 첫 번째 페이지에서 라우터로 전달해준 경도값
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement("script");
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap);
            script.src =
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8";
            document.head.appendChild(script);
            console.log("kakao mounted");
        }
    },

}
</script>

<style scoped>
#app {
    width: 100%;
    height: 100%;
}

.map-wrap {
    display: flex;
    width: 100%;
    height: 100%;
}

#map {
    z-index: 0;
    width: 100vw;
    height: 100%;
    position: relative;
}

#reSearch {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
    /* 버튼과 맵 사이의 간격 조절 */
    padding: 10px;
    /* 버튼의 내부 여백 */
    background-image: url('/src/assets/research.png');
    background-size: 100% 100%;
    color: white;
    /* 버튼 텍스트 색상 */
    border-radius: 50%;
    /* 버튼 모서리 둥글게 */
    cursor: pointer;
    /* 포인터로 마우스를 올렸을 때 커서 모양 변경 */
    width: 40px;
    height: 40px;
    border: 1px solid black;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.header {
    z-index: 10;
    background-color: #7788ff;
    height: 5%;
    display: flex;
    /* justify-content: flex-start; */
    align-items: center;
    width: 100vw;
}

.header>div {
    margin-left: 1rem;
    margin-right: 0;
    cursor: pointer;
}

.top-title {
    color: #fff;
    font-size: 2em;
    font-weight: 800;
    margin: 0 auto;
}

.container {
    position: inherit;
    display: flex;
    width: 100vw;
    height: 95%;
}

.slide {
    height: 95%;
    width: 400px;
    position: absolute;
    background-color: #fff;
    transition: 0.5s ease;
    transform: translateX(-400px);
    text-align: left;
    padding-left: 2em;
    border-radius: 0px 10px 10px 0px;
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
    position: absolute;
    height: 30px;
    width: 30px;
    top: 60px;
    /* 원하는 위치로 조정(체크박스) */
    left: 15px;
    /* 원하는 위치로 조정 */
    /* display: flex; */
    visibility: hidden;
    /* -webkit-appearance: none; */
    z-index: 20;
}

.toggle {
    position: absolute;
    height: 30px;
    width: 30px;
    top: 60px;
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
    width: 350px;
    top: 90%;
    left: 22.5px;
    z-index: 1;
    cursor: pointer;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    line-height: 60px;
    font-size: 2em;
    color: #5271ff;
}

.toggle_btm:hover {
    background-color: rgb(82, 113, 255, .1);
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
