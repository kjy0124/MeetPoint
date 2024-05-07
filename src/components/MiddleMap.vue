<template>
    <!--모달 창 (옵션 선택)-->
    <div class="modal-warper" v-if="modalOpen">
        <div class="modal-ctnt">
            <div class="modal-top">
                <div class="modal-top-title">지역선택</div>
                <hr>
                <div class="modal-mid" >
                    <span class="top-button-text">
                        <button class="btn btn-primary btn-ghost btn-address1" @click="selectAddressOption(address_name.depth1_name,1)">{{ address_name.depth1_name }}</button>
                    </span>
                    <span class="top-button-text">
                        <button class="btn btn-primary btn-ghost btn-address2" @click="selectAddressOption(address_name.depth2_name,2)">{{ address_name.depth2_name }}</button>
                    </span>
                </div>
                
            </div>
            <div class="modal-top">
                <div class="modal-top-title">옵션 선택(중복 선택 가능)</div>
                <hr>
                <div class="modal-mid">
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn1" @click="selectOption('먹거리/패션거리',1)">먹거리/패션거리</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn2" @click="selectOption('아쿠아리움/대형수족관',2)">아쿠아리움/대형수족관</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn3" @click="selectOption('유명관광지',3)">유명관광지</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn4" @click="selectOption('일반관광지',4)">일반관광지</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn5" @click="selectOption('캠핑',5)">캠핑</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn6" @click="selectOption('테마/놀이공원',6)">테마/놀이공원</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn7" @click="selectOption('폭포/계곡',7)">폭포/계곡</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn8" @click="selectOption('해수욕장',8)">해수욕장</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn9" @click="selectOption('관광안내소/매표소',9)">관광안내소/매표소</button></span>
                    <div class="modal-btm">
                        <button class="select-bttn" @click="modalReSearchClick()">재탐색</button>
                    </div>
                </div>
                
            </div>  
        </div>
    </div>
    <header class="header">
        <div><img src="@/assets/caret-modal-fill.svg" alt="뒤로가기" @click="moveBack()" /></div>
        <span class="top-title">중간지점 결과</span>
    </header>
    <div class="container">
        <div class="map-wrap">
            <div id="map"></div>
            <div id="reSearch" @click="reSearch()"></div>
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
import axios from 'axios';

export default {
    name: "MiddleMap",
    data() {
        return {
            modalOpen: false, // 모달 창 해제
            markers: [], // 사용자 위치 마커들 저장
            userData: [], // 사용자들 이름, 주소 데이터
            mpLatitude: "", // 중간좌표 위도
            mpLongitude: "", // 중간좌표 경도
            address_name: { // 중간 지점 주소 저장 변수 
                depth1_name: "", // ex : 경상남도
                depth2_name: "", // ex : 경산시
            },
            options: [], // 관광지 등 어떤 장소를 기준으로 새로운 중간지점을 선택할지 카테고리를 저장
            address_options: [], // 시도, 시군구를 선택했을 경우 저장할 배열
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

            // 사용자 위치 표시
            this.showUsersPosition()

            // 좌표를 주소로 반환
            this.addressInfo();
        },

        moveListPage() {
            this.$router.push({ name: "ListPage", params: {} });
        },

        moveBack() {
            this.$router.push({ path: "/", query: {} });
            this.$router.go(-1);
        },

        // URL 디코딩
        decode(cookieValue){
            const vm = this;
            var decodedCookieValue = decodeURIComponent(cookieValue);
            // (사용자 이름, 주소명, 주소, 위도, 경도 ) 순서대로 저장
            decodedCookieValue = decodedCookieValue.replaceAll("+", " ").split("=");
            vm.userData.push({
                name:decodedCookieValue[0],
                address_name: decodedCookieValue[1],
                address: decodedCookieValue[2],
                latlng: new window.kakao.maps.LatLng(parseFloat(decodedCookieValue[3]), parseFloat(decodedCookieValue[4])),
            })
        },

        // 사용자 위치 표시
        showUsersPosition() {
            const vm = this;
            var cookies = document.cookie.split(";"); // 쿠키를 불러와서 ;(세미콜론)을 기준으로 분할
            // var count = 1; // USER 뒤에 붙는 수
            // 쿠키를 순회하여 USER 쿠키에 저장된 값을 불러옴
            for( var i = 0; i < cookies.length; i++){ // 쿠키 순회하면서 원하는 쿠키 찾기(USER1 USER2 등)
                var cookie = cookies[i].trim();
                cookie = cookie.split("=");
                if(cookie[0].includes('USER')) {
                    vm.decode(cookie[1]);

                }
            }
            
            // 쿠키에서 추출한 값을 통해 사용자들 위치 마커 생성
            for(i = 0; i < vm.userData.length; i++) {

                var imageSrc = require('@/assets/location.png'), // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

                var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                // 마커를 생성합니다
                var marker = new window.kakao.maps.Marker({
                    map: vm.map, // 마커를 표시할 지도
                    position: vm.userData[i].latlng, // 마커의 위치
                    image: markerImage
                });

                // 마커에 표시할 인포윈도우를 생성합니다 
                var infowindow = new window.kakao.maps.InfoWindow({
                    content: `
                            <div id="infowindow" style="padding:5px;font-size:12px;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>${vm.userData[i].name}</strong></div>
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${vm.userData[i].address_name})</div>
                                <div style="margin-top: 5px;">${vm.userData[i].address}</div>
                            </div>` // 인포윈도우에 표시할 내용
                });
                vm.markers.push(marker);
                // 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
                // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                (function(marker, infowindow) {
                    // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
                    window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                        infowindow.open(vm.map, marker);
                    });

                    // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
                    window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                        infowindow.close();
                    });
                })(marker, infowindow);
            }
            
            vm.markers.forEach(marker => marker.setMap(vm.map));
        },

        // 재탐색 버튼 클릭시 모달창 보이기
        reSearch() {
            this.modalOpen = true;
        },
        
        // 재탐색에 필요한 옵션 버튼들을 클릭시 실행
        // 처음 클릭시 버튼의 배경색과 글자색을 바꿈. 이미선택한 걸 다시 선택시 처음 상태로 변경
        selectOption(value, num){
            const btn = document.querySelector('.btn' + num);
            if(this.options.includes(value)){ // 배열에 해당 값이 있을시 해당 값을 삭제
                this.options = this.options.filter((result) => result !== value);
                btn.style.backgroundColor = "#fff"; // 배경색 변경
                btn.style.color = '#5271ff'; // 글자색 변경
            } else {
                this.options.push(value);
                btn.style.backgroundColor = "#5271ff"; // 배경색 변경
                btn.style.color = '#fff'; // 글자색 변경
            }
        },

        // 모달창의 지역선택에 옵션들을 클릭했을 경우
        // 처음 클릭시 버튼의 배경색과 글자색을 바꿈. 이미선택한 걸 다시 선택시 처음 상태로 변경
        selectAddressOption(value, num){
            const btn = document.querySelector('.btn-address' + num);
            if(this.address_options.includes(value)){ // 배열에 해당 값이 있을시 해당 값을 삭제
                this.address_options = this.address_options.filter((result) => result !== value);
                btn.style.backgroundColor = "#fff"; // 배경색 변경
                btn.style.color = '#5271ff'; // 글자색 변경
            } else {
                this.address_options.push(value);
                btn.style.backgroundColor = "#5271ff"; // 배경색 변경
                btn.style.color = '#fff'; // 글자색 변경
            }

        },

        // 모달창의 재탐색 버튼
        modalReSearchClick(){
            const region = ["경기도", "경상남도", "경상북도", "광주광역시", "대구광역시", "대전광역시", "부산광역시", "서울특별시", "울산광역시", "인천광역시", "전라남도", "전라북도", "충청남도", "충청북도"];
            let reSearch_data = { // 재탐색에 필요한 데이터를 보낼 데이터 저장
                num : 0, // 0이면 시도,시군구 중 하나만 선택하거나, 둘 다 선택한 경우. 1이면 시군구만 선택한 경우
                region_1depth_name : "", // 시도
                region_2depth_name : "", // 시군구
                option : this.options,
            }
            // 배열에 저장된 것이 시도와 시군구를 구분하지 않고 저장 했으므로 어떤것이 시도인지 구분
            this.address_options.forEach(value => {
                if(region.indexOf(value) > 0){
                    reSearch_data.region_1depth_name = value; // 시도
                } else{
                    reSearch_data.region_2depth_name = value; // 시군구
                }
            })

            // 만약 대구광역시 동구 ... 이런식으로 나왔을 경우에 동구만 선택했을 경우
            // 대구광역시 동구에서만 검색하기 위해서
            if(reSearch_data.region_1depth_name === "" && reSearch_data.region_2depth_name !== ""){ // 시군구만 선택했을 경우
                reSearch_data.num = 1;
                reSearch_data.region_1depth_name = this.address_name.depth1_name;
            }

            axios({
                method: 'post',
                header: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: "/map/reSearchPoint",
                data: reSearch_data,
            })
                .then((response) => {
                    
                    if(response.data != null){
                        console.log("response data ", response.data);
                        console.log("latitude", response.data.latitude);
                        console.log("longitude", response.data.longitude);
                        console.log("mpLatitude", this.mpLatitude);
                        this.mpLatitude = response.data.latitude; // 새로운 위도
                        this.mpLongitude = response.data.longitude; // 새로운 경도
                        this.initMap(); // 새로운 중간 장소 생성
                        this.options = []; // 재탐색 옵션 선택한 것 초기화
                        this.address_options = []; // 재탐색 옵션에 지역선택한 것 초기화
                        this.modalOpen = false; // 모달창 닫기
                    }
                    else {
                        alert("죄송합니다. 현재 데이터가 부족하여 수집하고 있으니 다른 옵션을 선택하여 주세요.");
                    }
                })
                .catch((error) => {
                    alert("재탐색에 필요한 데이터를 불러오는데 실패하였습니다.");
                    console.log(error);
                });
        },


        // 중간지점 지번주소 반환 후 데이터 저장
        // 좌표를 가지고 주소로 변환 후 시도, 시군구를 추출
        addressInfo(){
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(this.mpLongitude, this.mpLatitude, (result, status) => {
                if(status === window.kakao.maps.services.Status.OK) {
                    // console.log("result" + JSON.stringify(result))
                    let address = result[0].address.region_1depth_name;
                    if(address === "경기") address = "경기도";
                    if(address === "경남") address = "경상남도";
                    if(address === "경북") address = "경상북도";
                    if(address === "광주") address = "광주광역시";
                    if(address === "대구") address = "대구광역시";
                    if(address === "대전") address = "대전광역시";
                    if(address === "부산") address = "부산광역시";
                    if(address === "서울") address = "서울특별시";
                    if(address === "울산") address = "울산광역시";
                    if(address === "인천") address = "인천광역시";
                    if(address === "전남") address = "전라남도";
                    if(address === "전북") address = "전라북도";
                    if(address === "충남") address = "충청남도";
                    if(address === "충북") address = "충청북도";
                    this.address_name.depth1_name = address; // ex. OO광역시,OOO도, OO특별자치도 등 저장
                    this.address_name.depth2_name = result[0].address.region_2depth_name; // ex. 시군구를 저장
                }
            })
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
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services";
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

.modal-ctnt {
    background-color: #fefefe;
    border-radius: 10px;
    width: 30%;
    height: 50%;
    padding: 1.5em;
    box-shadow: 0px 0px 20px rgb(0, 0, 0, .2);
}

.modal-top-title {
    color: #a1a1a1a1;
    font-size: 2.5em;
    margin-top: 1em;
    margin-bottom: 0.4em;
}

.modal-top-title {
    font-size: 2em;
    color: #a1a1a1a1;
}

.top-button-text {
    margin-top: 0.4em;
    font-size: 1.5em;
}

.modal-top {
    margin-bottom: 4em;
    height: 20%;
}

.modal-mid {
    margin-bottom: 4em;
    height: 10%;
}

.modal-btm {
    margin-top: 4em;
    height: 20%;
    text-align: right; /* 선택 버튼을 오른쪽 정렬 */
}

.select-bttn {
    height: 60px;
    width: 100px;
    cursor: pointer;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    font-size: 2em;
    color: #5271ff;
}

.select-bttn:hover {
    background-color: rgb(82, 113, 255, .1);
}

/* Ghost 버튼 스타일 */
.btn-primary.btn-ghost {
    width: auto; /* 가로 크기 자동 조정 */
    height: auto; /* 세로 크기 자동 조정 */
    display: inline-block; /* 한 줄에 나타내기 */
    border-radius: 10px; /* 모서리 둥글게 */
    border: 1px solid #5271ff; /* 테두리 색 설정 */
    background-color: transparent; /* 배경색 투명하게 */
    color: #5271ff; /* 글자색 */
    padding: 10px 20px; /* 내부 여백 */
    cursor: pointer;
    font-size: 1em; /* 글자 크기 */
    margin-right: 10px; /* 오른쪽 마진 추가 */
}

.btn-primary.btn-ghost:hover {
    background-color: rgba(82, 113, 255, 0.1);
}

/* HelloWorld 버튼 스타일 */
.modal-mid span {
    display: inline-block; /* 한 줄에 나타내기 */
    margin-right: 10px; /* 오른쪽 마진 추가 */
}

.btn-primary.btn-ghost + .btn-primary.btn-ghost {
    margin-left: 10px; /* Ghost 버튼과 간격 추가 */
}

/* 버튼 클릭시 버튼배경색 채우기 */
.btn1 .btn2 .btn3 .btn4 .btn5 .btn6 .btn7 .btn8 .btn9 .btn-address1 .btn-address2 {
    background-color: transparent; /* 배경색 투명하게 */
    color: #5271ff; /* 글자색 */
}
</style>
