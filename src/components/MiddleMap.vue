<template>
    <!--모달 창 (옵션 선택)-->
    <div class="modal-warper" v-if="modalOpen">
        <div class="modal-ctnt">
            <div class="modal-top">
                <div class="modal-top-title">지역선택</div>
                <hr>
                <div class="modal-mid">
                    <span class="top-button-text">
                        <button class="btn btn-primary btn-ghost btn-address1"
                            @click="selectAddressOption(address_name.depth1_name, 1)">{{ address_name.depth1_name
                            }}</button>
                    </span>
                    <span class="top-button-text">
                        <button class="btn btn-primary btn-ghost btn-address2"
                            @click="selectAddressOption(address_name.depth2_name, 2)">{{ address_name.depth2_name
                            }}</button>
                    </span>
                </div>

            </div>
            <div class="modal-top">
                <div class="modal-top-title">옵션 선택(중복 선택 가능)</div>
                <hr>
                <div class="modal-mid">
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn1"
                            @click="selectOption('먹거리/패션거리', 1)">먹거리/패션거리</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn2"
                            @click="selectOption('아쿠아리움/대형수족관', 2)">아쿠아리움/대형수족관</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn3"
                            @click="selectOption('유명관광지', 3)">유명관광지</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn4"
                            @click="selectOption('일반관광지', 4)">일반관광지</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn5"
                            @click="selectOption('캠핑', 5)">캠핑</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn6"
                            @click="selectOption('테마공원/대형놀이공원', 6)">테마공원/대형놀이공원</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn7"
                            @click="selectOption('폭포/계곡', 7)">폭포/계곡</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn8"
                            @click="selectOption('해수욕장', 8)">해수욕장</button></span>
                    <span class="top-button-text"><button class="btn btn-primary btn-ghost btn9"
                            @click="selectOption('관광안내소/매표소', 9)">관광안내소/매표소</button></span>
                    <div class="modal-btm">
                        <button class="select-bttn" @click="modalReSearchClick()">{{ modal_btn_name }}</button>
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
            <div class="slide-top">
                <h1>Meet Point</h1>
            </div>
            <div class="slide-mid">
                <ul>
                    <li v-for="(space, index) in check_space" :key="index">
                        <!-- check_space 배열에서 리스트 가져오기 -->
                        <div class="pl">
                            <!-- 리스트 안 삭제버튼 클릭시 리스트에서 삭제-->

                            <div class="place-info">
                                <!-- 마커의 추가하기 버튼 클릭시 리스트에 추가 -->
                                <div class="place-name">{{ space.name }}</div>
                                <div class="place-location">{{ space.location }}</div>
                                <div class="place-phone">{{ space.phone }}</div>
                            </div>
                            <button class="delete_Btn" @click="checkboxClear(space)" checked>
                                <img class="delete_img" src="@/assets/삭제버튼.png" alt="삭제">
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="slide-btm">
                <p class="toggle_btm" @click="moveListPage()">일정만들기</p>
            </div>
        </div>
    </div>
    <div class="category_list">
        <ul class="list_bubble_filter">
            <li v-for="(category, index) in categories" :key="index">
                <button @click="btnClick(category)" class="epehmC" :class="{ clicked: category_click[category.id] }">
                    <span :class="`category_click.bg${category.id}`"></span>
                    {{ category.name }}
                </button>
            </li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: "MiddleMap",
    data() {
        return {
            modal_btn_name: "닫기", // 재탐색 모달창 생성시 나타나는 버튼명
            modalOpen: false, // 모달 창 해제
            userMarkers : [], // 사용자 위치 마커들 저장
            markers: [], // 카테고리 마커들 저장
            userData: [], // 사용자들 이름, 주소 데이터
            userexist: [], // 사용자 세션에 들어갈 데이터
            mpLatitude: "", // 중간좌표 위도
            mpLongitude: "", // 중간좌표 경도
            mpName: "", // 재탐색을 통해 주소 이름 저장
            address_name: { // 중간 지점 주소 저장 변수 
                depth1_name: "", // ex : 경상남도
                depth2_name: "", // ex : 경산시
            },
            options: [], // 관광지 등 어떤 장소를 기준으로 새로운 중간지점을 선택할지 카테고리를 저장
            address_options: [], // 시도, 시군구를 선택했을 경우 저장할 배열

            category_click: {
                food: false,
                cafe: false,
                pension: false,
                paking: false,
                coupon: false,
                order: false,
            },
            categories: [
                { id: "CS2", name: "편의점" },
                { id: "MT1", name: "마트" },
                { id: "FD6", name: "음식점" },
                { id: "CE7", name: "카페" },
                { id: "BK9", name: "은행" },
                { id: "AD5", name: "숙박" },
                { id: "CT1", name: "문화시설" },
                { id: "AT4", name: "관광명소" },
                { id: "PK6", name: "주차장" },
                { id: "OL7", name: "주유소" },
                { id: "SW8", name: "지하철역" },
            ],
            check_space: [], //체크된 장소
            addrName: "", // ListPage로 전달할 주소명
            addrBuildingName: "", // ListPage로 전달할 건물명
        };
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

            const imageSrc = require('@/assets/중간지점.png');
            const imageSize = new kakao.maps.Size(50, 50);
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            //중간 지점 마커 생성
            const markerPosition = new window.kakao.maps.LatLng(this.mpLatitude, this.mpLongitude);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
            });

            //인포윈도우 열림 여부 확인 변수
            let infowindowOpened = false;

            // Geocoder 객체 생성
            const geocoder = new kakao.maps.services.Geocoder();

            // 중간 지점의 좌표를 주소로 변환하여 가져오기
            geocoder.coord2Address(this.mpLongitude, this.mpLatitude, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 주소를 가져오는데 성공했을 때
                    const address = result[0].address.address_name;
                    const roadAddress = result[0].road_address;
                    let name = "";
                    if (roadAddress) {
                        name = roadAddress.building_name; // road_address가 존재하면 building_name을 할당, 아니면 빈 문자열 할당
                        // this.addrName = name; // 주소명이 정확하게 있을 경우
                        if (name) { // 건물명이 있을 경우
                            this.addrBuildingName = name; // ListPage에 넘길 건물명 이름
                        } else {
                            this.addrName = roadAddress.address_name; // ListPage에 넘길 도로주소명
                        }
                    } else {
                        name = ""; //건물 없을 시 공백처리
                        this.addrName = address; // 주소명이 정확하게 없을 경우 도로주소를 저장
                    }

                    if (this.mpName) {
                        name = this.mpName;
                        this.addrBuildingName = name; // 지명
                    }

                    // 마커 클릭 시 인포윈도우에 주소 정보 표시
                    const infowindowContent = `
                        <div style="padding:5px;font-size:12px;">
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>중간 지점</strong></div>
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${name}</div>
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">지번: ${address})</div>
                        </div>`;
                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: infowindowContent,
                    });

                    kakao.maps.event.addListener(marker, 'click', () => {
                        if (infowindowOpened) { // 인포윈도우가 열려있다면
                            infowindow.close(); // 인포윈도우 닫기
                            infowindowOpened = false; // 열림 여부 변수 업데이트
                        } else {
                            infowindow.open(this.map, marker);
                            infowindowOpened = true; // 열림 여부 변수 업데이트
                        }
                    });
                }
            });
            //마커 지도에 띄우기
            marker.setMap(this.map);
            // 여러 마커들을 한눈에 보기 쉽도록 지도 레벨 설정
            this.allViewMarkers(marker);
        },

        // 여러 마커들을 한 눈에 보기 위해 지도 범위 재설정
        allViewMarkers(mpMarker) {
            // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성
            var bounds = new kakao.maps.LatLngBounds();
            this.userMarkers.forEach(marker => {
                // LatLngBounds 객체에 사용자 위치 좌표를 추가
                bounds.extend(marker.getPosition());
            })
            // LatLngBounds 객체에 중간 좌표를 추가
            bounds.extend(mpMarker.getPosition());
            // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정
            // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
            this.map.setBounds(bounds);
        },

        moveListPage() {
            const mpLatLng = {
                lat: this.mpLatitude,
                lon: this.mpLongitude,
            }
            sessionStorage.setItem("meetPoint", this.addrName);
            sessionStorage.setItem("buildingName", this.addrBuildingName);
            sessionStorage.setItem("mpLatLng", JSON.stringify(mpLatLng));
            sessionStorage.setItem("selectInfo", JSON.stringify(this.check_space));

            this.$router.push({
                path: "/ListPage.page",
                query: { "mpLat": this.mpLatitude, "mpLon": this.mpLongitude },
            });
        },

        moveBack() {
            this.$router.push({ path: "/", query: {} });
            this.$router.go(-1);
        },

        // URL 디코딩
        decode(cookieValue) {
            const vm = this;
            var decodedCookieValue = decodeURIComponent(cookieValue);
            // (사용자 이름, 주소명, 주소, 위도, 경도 ) 순서대로 저장
            decodedCookieValue = decodedCookieValue.replaceAll("+", " ").split("=");
            vm.userData.push({
                name: decodedCookieValue[0],
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
            for (var i = 0; i < cookies.length; i++) { // 쿠키 순회하면서 원하는 쿠키 찾기(USER1 USER2 등)
                var cookie = cookies[i].trim();
                cookie = cookie.split("=");
                if (cookie[0].includes('USER')) {
                    vm.decode(cookie[1]);
                }
            }

            // 쿠키에서 추출한 값을 통해 사용자들 위치 마커 생성
            for (let i = 0; i < vm.userData.length; i++) {
                (function (i) {
                    let rand0_5 = 0
                    if(vm.userexist.length == vm.userData.length){
                        rand0_5 = vm.userexist[i];
                    }
                    else{
                        rand0_5 = Math.floor(Math.random() * 6);
                        vm.userexist.push(rand0_5);   
                    }
                    const imageSrc = require('@/assets/human' + rand0_5 + '.png'); // 마커 이미지의 주소입니다    
                    const imageSize = new kakao.maps.Size(50, 50); // 마커 이미지의 크기입니다
                    const hoverImageSize = new kakao.maps.Size(40, 40); // 호버했을 때 마커 이미지의 크기입니다

                    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
                    const hoverMarkerImage = new window.kakao.maps.MarkerImage(imageSrc, hoverImageSize);                   

                    // 마커를 생성합니다
                    const marker = new window.kakao.maps.Marker({
                            map: vm.map, // 마커를 표시할 지도
                            position: vm.userData[i].latlng, // 마커의 위치
                            image: markerImage
                        });

                    // 마커에 mouseover 이벤트 리스너를 추가합니다
                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        marker.setImage(hoverMarkerImage);
                    });

                    // 마커에 mouseout 이벤트 리스너를 추가합니다
                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        marker.setImage(markerImage);
                    });

                    // 마커에 표시할 인포윈도우를 생성합니다 
                    var infowindow = new window.kakao.maps.InfoWindow({
                        content: `
                            <div id="infowindow" style="padding:5px;font-size:12px;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>${vm.userData[i].name}</strong></div>
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${vm.userData[i].address_name}</div>
                                <div style="margin-top: 5px;">${vm.userData[i].address}</div>
                            </div>` // 인포윈도우에 표시할 내용
                    });
                    vm.userMarkers.push(marker);
                    // 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
                    // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                    (function (marker, infowindow) {
                        // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
                        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                            infowindow.open(vm.map, marker);
                        });

                        // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
                        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                            infowindow.close();
                        });
                    })(marker, infowindow);
                })(i);
            }
            sessionStorage.setItem('markerImageName', JSON.stringify(vm.userexist));
            vm.userMarkers.forEach(marker => marker.setMap(vm.map));
        },

        // 재탐색 버튼 클릭시 모달창 보이기
        reSearch() {
            this.modalOpen = true;
        },

        // 재탐색에 필요한 옵션 버튼들을 클릭시 실행
        // 처음 클릭시 버튼의 배경색과 글자색을 바꿈. 이미선택한 걸 다시 선택시 처음 상태로 변경
        selectOption(value, num) {
            const btn = document.querySelector('.btn' + num);
            if (this.options.includes(value)) { // 배열에 해당 값이 있을시 해당 값을 삭제
                this.options = this.options.filter((result) => result !== value);
                btn.style.backgroundColor = "#fff"; // 배경색 변경
                btn.style.color = '#5271ff'; // 글자색 변경
            } else {
                this.options.push(value);
                btn.style.backgroundColor = "#5271ff"; // 배경색 변경
                btn.style.color = '#fff'; // 글자색 변경
            }
            this.modal_btn_name = (this.address_options == "" && this.options == "") ? '닫기' : '재탐색';
        },

        // 모달창의 지역선택에 옵션들을 클릭했을 경우
        // 처음 클릭시 버튼의 배경색과 글자색을 바꿈. 이미선택한 걸 다시 선택시 처음 상태로 변경
        selectAddressOption(value, num) {
            const btn = document.querySelector('.btn-address' + num);
            if (this.address_options.includes(value)) { // 배열에 해당 값이 있을시 해당 값을 삭제
                this.address_options = this.address_options.filter((result) => result !== value);
                btn.style.backgroundColor = "#fff"; // 배경색 변경
                btn.style.color = '#5271ff'; // 글자색 변경
            } else {
                this.address_options.push(value);
                btn.style.backgroundColor = "#5271ff"; // 배경색 변경
                btn.style.color = '#fff'; // 글자색 변경
            }
            // 지역을 선택하지 않으면 버튼이름을 닫기로 설정
            this.modal_btn_name = (this.address_options == "" && this.options == "") ? '닫기' : '재탐색';
        },

        // 모달창의 재탐색 버튼
        modalReSearchClick() {
            if (this.modal_btn_name == "닫기") {
                this.modalOpen = false;
                return false;
            }
            if (this.address_options == "") {
                alert("지역을 선택하여 주시기 바랍니다.");
                return;
            }
            if (this.options == "") {
                alert("옵션을 한개이상 선택해주시기 바랍니다.");
                return;
            }
            const region = ["경기도", "경상남도", "경상북도", "광주광역시", "대구광역시", "대전광역시", "부산광역시", "서울특별시", "울산광역시", "인천광역시", "전라남도", "전라북도", "충청남도", "충청북도"];
            let reSearch_data = { // 재탐색에 필요한 데이터를 보낼 데이터 저장
                num: 0, // 0이면 시도만 선택하거나, 둘 다 선택한 경우. 1이면 시군구만 선택한 경우
                region_1depth_name: "", // 시도
                region_2depth_name: "", // 시군구
                option: this.options,
            }
            // 배열에 저장된 것이 시도와 시군구를 구분하지 않고 저장 했으므로 어떤것이 시도인지 구분
            this.address_options.forEach(value => {
                if (region.indexOf(value) > 0) {
                    reSearch_data.region_1depth_name = value; // 시도
                } else {
                    reSearch_data.region_2depth_name = value; // 시군구
                }
            })

            // 만약 대구광역시 동구 ... 이런식으로 나왔을 경우에 동구만 선택했을 경우
            // 대구광역시 동구에서만 검색하기 위해서
            if (reSearch_data.region_1depth_name === "" && reSearch_data.region_2depth_name !== "") { // 시군구만 선택했을 경우
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
                    if (response.data != "") {
                        this.mpLatitude = response.data.latitude; // 새로운 위도
                        this.mpLongitude = response.data.longitude; // 새로운 경도
                        this.mpName = response.data.name; // 새로운 주소 이름
                        this.initMap(); // 새로운 중간 장소 생성
                        this.options = []; // 재탐색 옵션 선택한 것 초기화
                        this.address_options = []; // 재탐색 옵션에 지역선택한 것 초기화
                        this.modalOpen = false; // 모달창 닫기
                    }
                    else {
                        alert("해당 지역에 선택하신 옵션의 장소가 없습니다. \n다른 옵션을 선택하여 주세요.");
                    }
                })
                .catch(() => {
                    alert("재탐색에 필요한 데이터를 불러오는데 실패하였습니다.");
                });
        },

        // 중간지점 지번주소 반환 후 데이터 저장
        // 좌표를 가지고 주소로 변환 후 시도, 시군구를 추출
        addressInfo() {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(this.mpLongitude, this.mpLatitude, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    let address = result[0].address.region_1depth_name;
                    if (address === "경기") address = "경기도";
                    if (address === "경남") address = "경상남도";
                    if (address === "경북") address = "경상북도";
                    if (address === "광주") address = "광주광역시";
                    if (address === "대구") address = "대구광역시";
                    if (address === "대전") address = "대전광역시";
                    if (address === "부산") address = "부산광역시";
                    if (address === "서울") address = "서울특별시";
                    if (address === "울산") address = "울산광역시";
                    if (address === "인천") address = "인천광역시";
                    if (address === "전남") address = "전라남도";
                    if (address === "전북") address = "전라북도";
                    if (address === "충남") address = "충청남도";
                    if (address === "충북") address = "충청북도";
                    this.address_name.depth1_name = address; // ex. OO광역시,OOO도, OO특별자치도 등 저장
                    this.address_name.depth2_name = result[0].address.region_2depth_name; // ex. 시군구를 저장
                }
            })
        },

        btnClick(category) {
            //클릭한 카테고리 버튼만 활성화
            for (let key in this.category_click) {
                this.category_click[key] = false;
            }
            this.category_click[category.id] = true;

            //해당하는 카테고리의 마커를 지도에 표시
            this.fetchNearbyPlaces(category);
        },

        // 자동으로 주변 장소 가져와서 마커 생성하는 함수
        fetchNearbyPlaces(target_category) {
            this.clearMarkers();

            //중간 위치로 지도 이동
            const locPosition = new window.kakao.maps.LatLng(this.mpLatitude, this.mpLongitude);

            // kakao.maps 객체가 존재하는지 확인
            if (window.kakao.maps && window.kakao.maps.services) {
                // kakao.maps.services.Places()가 존재하는지 확인
                if (window.kakao.maps.services.Places) {
                    const placesService = new window.kakao.maps.services.Places();

                    // 검색 결과 반환받을 함수
                    var callback = function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            this.saveMarkersByCategory(result, target_category);
                            this.showCircle(locPosition, 5000);//반경을 원으로 표시
                        } else {
                            alert('장소 검색에 실패했습니다:', status);
                        }
                    }.bind(this);

                    // 주변 장소 검색 요청
                    placesService.categorySearch(target_category.id, callback, {
                        location: locPosition,
                        radius: 5000,
                        useMapCenter: false
                    });
                } else {
                    alert('Places 서비스를 찾을 수 없습니다.');
                }
            } else {
                alert('kakao.maps 또는 kakao.maps.services를 찾을 수 없습니다.');
            }
        },

        showCircle(centerPosition, radius) {
            const circle = new window.kakao.maps.Circle({
                center: centerPosition,  // 중심 좌표
                radius: radius,          // 원의 반지름(미터단위)
                strokeWeight: 2,         // 두께
                strokeColor: '#5271ff',  // 색
                strokeOpacity: 0.8,      // 선의 불투명도
                strokeStyle: 'solid',    // 종류('solid', 'shortdash', 'shortdot', 'shortdashdot', 'shortdashdotdot', 'dot', 'dash', 'longdash', 'longdashdot', 'longdashdotdot')
            });

            // 원을 지도에 표시합니다
            circle.setMap(this.map);
        },

        saveMarkersByCategory(result, target_category) {
            //새로운 카테고리의 마커를 추가하기 전에 이전 카테고리 마커 모두 삭제
            this.clearMarkers();

            //사용자 위치 마커 유지
            // this.showUsersPosition();

            //마커 정보 추출
            result.forEach(place => {
                const mapCategory = place.category_group_code;
                const marker = new window.kakao.maps.Marker({
                    map: this.map,
                    position: new window.kakao.maps.LatLng(place.y, place.x),
                    title: place.place_name, //마커에 표시될 타이틀 설정
                    category: mapCategory //카테고리 정보 저장
                });

                //마커 클릭이벤트 (마커 삭제 추가)
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    //현재 열려있는 인포윈도우가 있다면 닫기
                    if (marker.infowindow) {
                        //마커의 인포윈도우가 열려 있으면 닫기
                        marker.infowindow.close();
                        marker.infowindow = null;
                    } else {
                        // 모든 마커의 인포윈도우 닫기
                        this.markers.forEach(otherMarker => {
                            if (otherMarker.infowindow) {
                                otherMarker.infowindow.close();
                                otherMarker.infowindow = null
                            }
                        });
                        //새로운 인포윈도우 열기
                        marker.infowindow = new window.kakao.maps.InfoWindow({
                            content: `
                            <div style="padding:5px;font-size:12px;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>${place.place_name}</strong></div>
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">(지번: ${place.address_name})</div>
                                <div style="margin-top: 5px;color: #5271ff;">${place.phone}</div>
                                <div style="margin-top: 5px;"><a href="${place.place_url}" target="_blank">상세보기</a></div>
                                <div style="margin-top: 5px;">
                                    <label>
                                        <button type="button" class="placeCheckbox" 
                                            data-name="${place.place_name}"
                                            data-location="${place.address_name}"
                                            data-phone="${place.phone}"
                                            data-url="${place.place_url}">
                                            추가하기
                                    </label>
                                </div>
                            </div>`
                        });
                        marker.infowindow.open(this.map, marker);

                        //button 감지 이벤트
                        const button = document.querySelector('.placeCheckbox'); //.placeChaeckbox 값 찾아서 반환

                        if (button) button.addEventListener('click', this.handleCheckboxChange); //버튼 클릭시 HandleCheckboxChange 함수 호출
                        // handleCheckboxChange 호출하며 동시에 event.target 이벤트 활성화, --> 위의 data-name, data-location, data-phone 데이터 값 참조
                    }
                });
                //생성한 마커를 markers 배열에 추가
                this.markers.push(marker);
            });
            //마커 띄우기
            this.showMarkersByCategory(target_category.id);
        },

        clearMarkers() {
            //이전 카테고리의 마커 삭제
            this.markers.forEach(marker => {
                marker.setMap(null);
                if (marker.infowindow) {
                    marker.infowindow.close(); // 연결된 정보 창 닫기
                    marker.infowindow = null; //인포윈도우 객체 초기화
                }
            });
            this.markers = [];
        },

        showMarkersByCategory(category) {
            //선택한 카테고리에 해당하는 마커만 지도에 표시
            const markers = this.markers.filter(marker => {
                return marker.category == category
            });
            markers.forEach(marker => marker.setMap(this.map));
        },
        handleCheckboxChange(event) {
            //추가하기 클릭 시 리스트에 추가
            const placeName = event.target.dataset.name;
            const placeLocation = event.target.dataset.location;
            const placePhone = event.target.dataset.phone;
            const placeUrl = event.target.dataset.url;
            var checkbox = document.getElementById('eachforid')
            checkbox.checked = true;

            //이미 선택된 장소인지 확인(중복 장소 검사)
            const isAlreadyAdded = this.check_space.some(space => { //밑의 조건과 같이 check_space에 데이터 값들의 중복 검사하는 변수
                //space에 저장된 장소 이름, 상세 주소, 장소 번호 중복 검사
                return space.name === placeName && space.location === placeLocation && space.phone === placePhone
            });

            //중복 장소가 아니면 추가
            if (!isAlreadyAdded) {
                //새로운 장소를 check_space 배열에 추가
                this.check_space.push({ name: placeName, location: placeLocation, phone: placePhone, placeurl: placeUrl });
            }
        },
        checkboxClear(space) {
            //체크박스 클릭시 배열에서 삭제
            const index = this.check_space.indexOf(space);
            if (index !== -1) {
                this.check_space.splice(index, 1);
            }
        },
    },

    created() {
        //category_click 객체 초기화
        for (let key in this.category_click) {
            this.category_click[key] = false;
        }
    },
    mounted() {
        if (JSON.parse(sessionStorage.getItem('markerImageName')) != null || JSON.parse(sessionStorage.getItem('markerImageName')) != undefined){
            this.userexist = JSON.parse(sessionStorage.getItem('markerImageName'));
        }
        this.mpLatitude = this.$route.query.mpLatitude; // 첫 번째페이지에서 라우터로 전달해준 위도값
        this.mpLongitude = this.$route.query.mpLongitude; // 첫 번째 페이지에서 라우터로 전달해준 경도값
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement("script");
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap);
            script.src =
                "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services,clusterer,drawing";
            document.head.appendChild(script);
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

/* 재탐색 버튼 마우스오버시 회전*/
#reSearch:hover {
    animation: rotate_image 1.8s linear infinite;
    transform-origin: 50% 50%;
}

@keyframes rotate_image {
    100% {
        transform: rotate(360deg);
    }
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
    display: flex;
    flex-direction: column;
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

.slide-top {
    height: 10%;
    flex: none;
}

.slide-top h1 {
    font-size: 3em;
}

.slide-mid {
    height: 80%;
    overflow: auto;
}

.slide-btm {
    height: 10%;
    flex: none;
    margin-top: 1em;
}

.toggle_btm {
    position: absolute;
    height: 65px;
    width: 350px;
    top: 91%;
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
    width: 90%;
    max-width: 600px;
    height: auto;
    padding: 1.5em;
    box-shadow: 0px 0px 20px rgb(0, 0, 0, .2);
    margin: 5% auto;
}

.modal-top-title {
    color: #a1a1a1;
    font-size: 1.5em;
    margin-top: 1em;
    margin-bottom: 0.4em;
    text-align: center;
}

.top-button-text {
    margin-top: 0.4em;
    font-size: 1.5em;
}

.modal-top .modal-mid {
    margin-bottom: 2em;
    text-align: center;
}


.modal-btm {
    margin-top: 2em;
    text-align: right;
    /* 선택 버튼을 오른쪽 정렬 */
    display: flex;
    justify-content: center;
}

.select-bttn {
    height: 2em;
    width: 5em;
    cursor: pointer;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    font-size: 2.3em;
    color: #5271ff;
}

.select-bttn:hover {
    background-color: rgb(82, 113, 255, .1);
}

@media (max-width: 600px) {
    .modal-ctnt {
        width: 95%;
    }

    .modal-top-title {
        font-size: 1.2em;
    }

    .top-button-text {
        font-size: 0.9em;
    }

    .select-bttn {
        height: 2.5em;
        width: 6em;
        font-size: 0.9em;
    }
}

/* Ghost 버튼 스타일 */
.btn-primary.btn-ghost {
    width: auto;
    /* 가로 크기 자동 조정 */
    height: auto;
    /* 세로 크기 자동 조정 */
    display: inline-block;
    /* 한 줄에 나타내기 */
    border-radius: 10px;
    /* 모서리 둥글게 */
    border: 1px solid #5271ff;
    /* 테두리 색 설정 */
    background-color: transparent;
    /* 배경색 투명하게 */
    color: #5271ff;
    /* 글자색 */
    padding: 10px 20px;
    /* 내부 여백 */
    cursor: pointer;
    font-size: 1em;
    /* 글자 크기 */
    margin-right: 10px;
    /* 오른쪽 마진 추가 */
}

.btn-primary.btn-ghost:hover {
    background-color: rgba(82, 113, 255, 0.1);
}

/* HelloWorld 버튼 스타일 */
.modal-mid span {
    display: inline-block;
    /* 한 줄에 나타내기 */
    margin-right: 10px;
    /* 오른쪽 마진 추가 */
}

.btn-primary.btn-ghost+.btn-primary.btn-ghost {
    margin-left: 10px;
    /* Ghost 버튼과 간격 추가 */
}

/* 버튼 클릭시 버튼배경색 채우기 */
.btn1 .btn2 .btn3 .btn4 .btn5 .btn6 .btn7 .btn8 .btn9 .btn-address1 .btn-address2 {
    background-color: transparent;
    /* 배경색 투명하게 */
    color: #5271ff;
    /* 글자색 */
}

/* .category_list{
    width: 45%;
    height: 4%;
    position: absolute;
    left: 30%;
    top: 10%;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    white-space: nowrap;
    z-index: 1;
    display: flex;
}

.category_list .list_bubble_filter li {
    display: inline-block;
} */
.category_list {
    position: absolute;
    right: 2%;
    top: 8%;
    border-radius: 5px;
    white-space: nowrap;
    z-index: 1;
    display: flex;
}

.list_bubble_filter {
    list-style-type: none;
    padding: 0;
}

.list_bubble_filter li {
    display: inline-block;
    margin-right: 10px;
    /* 각 버튼 사이의 간격 조절 */
}

.epehmC {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 20px;
    /* 둥근 모서리 */
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
    /* 호버 효과를 위한 전이 효과 */
}

.epehmC:hover {
    background-color: #f0f0f0;
    border-color: #aaaaaa;
}

.clicked {
    background-color: #7788ff;
    /* 선택된 버튼의 배경색 */
    color: #ffffff;
    /* 선택된 버튼의 텍스트 색상 */
}

.clicked:hover {
    background-color: #9ea9ff;
    /* 선택된 버튼에 호버 시 배경색 변경 */
}

.pl {
    margin: 3%;
    display: flex;
    justify-content: flex-start;
    text-align: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    height: 20%;
    padding: 1em;
    position: relative;
}

.place-name {
    font-weight: bold;
    font-size: 13px;
    text-align: left;
}

.place-location {
    text-align: left;
}

.place-phone {
    color: #5271ff;
    text-align: left;
}

.place-info {
    padding-left: 1em;
}

.delete_img {
    height: 20px;
    width: 20px;
}

.delete_Btn {
    /* display: flex; */
    margin-left: auto;
    background: none;
    border: none;
}
</style>
