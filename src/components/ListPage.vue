<template>
    <div class="container">
        <!--모달 창 (날짜 선택)-->
        <div class="modal-warper" v-if="modalOpen">
            <div class="modal-ctnt">
                <div class="modal-top">
                    <div class="top-title">일정을 선택해주세요!</div>
                    <div class="top-text">*일정은 <b>최대 7일</b>까지 선택 가능합니다*</div>
                </div>
                <div class="modal-mid">
                    <div class="modal-mid-text">
                        <div class="planStart">일정 시작</div>
                        <div class="planEnd">일정 종료</div>
                    </div>
                    <input type="date" name="" class="square-date" :class="{ 'date-placeholder': selectedStartDate }"
                        @change="handleDateChange('start')">
                    <span class="mulgeul">~</span>

                    <input type="date" name="" id="search-date" class="square-date"
                        :class="{ 'date-placeholder': selectedEndDate }" @change="handleDateChange('end')">
                </div>
                <div calss="modal-btm">
                    <button class="select-bttn" @click="modalClick()">선택</button>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <div class="side-left">
                <div class="step1">STEP 1 <br>날짜 확인</div>
                <div class="step2">STEP 2 <br>장소 선택</div>
                <div class="step3">STEP 3 <br>숙소 설정</div>
                <div class="step3">STEP 4 <br>카카오톡 URL<br>공유하기</div>
            </div>
            <div class="side-middle">
                <div class="notScrollArea">
                    <div @click="modalOpen = true" class="selectDate">
                        <h2 class="meetPoint">{{ meetPoint != "" ? meetPoint : mpBuildingName }}</h2>
                        <p v-if="!selectedEndDate || !selectedStartDate">일정을 입력해주세요!</p>
                        <p v-if="selectedStartDate && selectedEndDate">{{ selectedStartDate + '(' +
                            this.selectedStartDay +
                            ')' }}
                            ~ {{ selectedEndDate + '(' + this.selectedEndDay + ')' }}</p>
                    </div>
                </div>
                <div class="scrollArea">
                    <div class="selectInfo" v-for="(info, i) in selectInfo" :key="i">
                        <input class="checkBox" :id="'checkedBox' + i" type="checkbox" @change="addCheckInfo(i)">
                        <div class="infoWarper">
                            <h2>{{ info.name }}</h2>
                            <h3>{{ info.location }}</h3>
                            <h3>{{ info.phone }}</h3>
                            <a :href=info.placeurl target="_blank" style="cursor: pointer">상세보기</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="side-rightMain">
                <h2 class="total-time">{{ selectedStayTime.hour + '시간 ' + selectedStayTime.minute + '분 / ' +
                    selectedDiffHour + '시간 0분' }}</h2>
                <div class="scrollArea2">
                    <div v-for="(info, i) in addCheckInfoList" :key="i" class="acilWarp">
                        <div class="addCheckInfoList">
                            <div class="infoList-left">
                                <p :class="'timeSet' + i" class="timeSett">{{ i + 1 }}</p>
                                <div class="rR">
                                    <h3 :class="'timeSet' + i">{{ info.name }}</h3>
                                </div>
                                <div class="lL">
                                    <button @click="timeSet(i)" :class="'timeSet' + i">{{ time_store[i].hour }}시간 {{
                                        time_store[i].minute }}분</button>
                                </div>
                            </div>
                            <div class="infoList-right">
                                <p :class="'timeSetClose' + i" style="display: none;">머무는 시간 설정</p>
                                <input :class="'timeSetClose' + i" style="width: 100px; height: 27px; display: none;"
                                    type="number" min='0' max='24' v-model="time_store[i].hour">
                                <p :class="'timeSetClose' + i" style="display: none;">시간</p>
                                <input :class="'timeSetClose' + i" style="width: 100px; height: 27px; display: none;"
                                    type="number" min='0' max='59' v-model="time_store[i].minute">
                                <p :class="'timeSetClose' + i" style="display: none;">분</p>
                                <button :class="'timeSetClose' + i" style="display: none;"
                                    @click="timeClose(i)">완료</button>
                            </div>
                        </div>
                        <div v-if="i<addCheckInfoList.length -1" class="durationTime">▼ 예상 소요시간 : {{ durationTime[i] }}</div>
                    </div>
                </div>
                <div class="share-button">
                    <button id="share_button" @click="storePlace()">
                        <img class="share_img" src="@/assets/카카오톡로고.png" alt="공유">
                    </button>
                </div>>
            </div>
        </div>
        <div class="map-wrap">
            <div id="map"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';

export default {
    name: "ListPage",
    data() {
        return {
            modalOpen: false, //모달의 상태 여부
            modalOpen2: false,
            selectedStartDate: null, //일정 시작 날짜
            selectedStartDay: null, //일정 시작 날짜 요일
            selectedEndDate: null, //일정 종료 날짜
            selectedEndDay: null, //일정 종료 날짜 요일
            selectedDiffDate: null, //일정 일수 차이 값
            selectedDiffHour: null, //총 일정 수의 시간 값
            meetPoint: '', //이전 페이지의 중간지점 주소
            mpBuildingName: '', // 이전 페이지의 건물명
            selectInfo: [ //이전 페이지에서 체크박스 선택한 장소들의 오브젝트
            ],
            addCheckInfoList: [], // 체크한 장소 정보를 담을 배열 추가
            markers: [],
            infowindows: [],

            // 시간 저장
            time_store: [],
            // 머무른 시간 저장
            selectedStayTime: {
                hour: 0, // 시
                minute: 0, // 분
            },
            // 중복방지를 위해 이전 시간 저장
            beforeTime: [],

            // 중간지점 마커 위도 경도
            mpLatLng: {
                lat: 0,
                lng: 0,
            },

            // 중간지점 마커 클릭 여부
            infowindowOpened: false,

            //duration 자차 이동시간
            durationTime: [(reactive)],

            //자차이동 총시간 저장
            durationHour: 0,
            durationMinute : 0,
        }
    },
    methods: {
        // 공유하기위해 데이터를 DB에 저장
        storePlace() {
            // 체크박스로 선택한 장소들에 머무는 시간까지 같이 저장하도록 하기 위해 선언
            let newAddCheckInfoList = this.addCheckInfoList;
            newAddCheckInfoList.forEach((place, index) => {
                place.hour = this.time_store[index].hour;
                place.minute = this.time_store[index].minute;
            })
            const data = {
                meetPoint: this.meetPoint,
                buildingName: this.mpBuildingName,
                mpLat: this.mpLatLng.lat,
                mpLon: this.mpLatLng.lng,
                selectInfo: this.selectInfo, // middleMap에서 선택한 장소들
                addCheckInfoList: newAddCheckInfoList, // 머무는 시간을 설정한 장소들
                stayTimeHour: this.selectedStayTime.hour,
                stayTimeMinute: this.selectedStayTime.minute,
            }
            axios({
                method: 'post',
                header: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: "/choice/storePlace",
                data: data,
            })
                .then((response) => {
                    if(response.data.index == -1 ){
                        alert("데이터를 저장하는데 오류가 발생하였습니다.");
                    } else {
                        this.sharekakao(response.data.index);
                    }
                })
                .catch(function () {
                    alert("데이터를 저장하는데 오류가 발생하였습니다.");
                })
        },

        // 머무는 시간 설정
        timeSet(index) {
            var classNames = document.querySelectorAll(".timeSet" + index);
            classNames.forEach(function (className) {
                className.style.display = "none";
            })

            classNames = document.querySelectorAll(".timeSetClose" + index);
            classNames.forEach(function (className) {
                className.style.display = "flex";
            })

            // 중복방지를 위해 머무르는 시간에 변경전 해당 장소에 머무르는 시간을 저장
            if (this.beforeTime[index]) { // 이미 존재하는 장소의 머무는 시간을 다시 지정할 경우
                this.beforeTime[index].hour = this.time_store[index].hour;
                this.beforeTime[index].minute = this.time_store[index].minute;
            } else {
                const time = {
                    hour: 2,
                    minute: 0
                };
                this.beforeTime[index] = time;
            }
        },
        // 머무는 시간 설정 닫기
        timeClose(index) {
            var classNames = document.querySelectorAll(".timeSetClose" + index);
            classNames.forEach(function (className) {
                className.style.display = "none";
            })
            classNames = document.querySelectorAll(".timeSet" + index);
            classNames.forEach(function (className) {
                className.style.display = "inline";
            })

            // 이전에 선택해 놓은 장소의 시간이 존재할 경우
            if (this.beforeTime[index]) {
                if (this.selectedStayTime.minute - this.beforeTime[index].minute < 0) {
                    this.selectedStayTime.hour = (this.selectedStayTime.hour - 1) - this.beforeTime[index].hour;
                    this.selectedStayTime.minute = this.selectedStayTime.minute + 60 - this.beforeTime[index].minute;
                } else {
                    this.selectedStayTime.hour -= this.beforeTime[index].hour;
                    this.selectedStayTime.minute -= this.beforeTime[index].minute;
                }

            }
            var sumTime = this.selectedStayTime.minute + this.time_store[index].minute // 총머무르는 분(minute) 더하기 + 새로등록한 머무르는 분(minute)
            this.selectedStayTime.hour += this.time_store[index].hour; // 총머무르는 시간(hour) 더하기 + 새로등록한 머무르는 시간(hour)
            // 완료(추가)시 총 머무르는 시간에 해당 장소에 머무르는 시간을 더하기
            if (sumTime > 59) {
                this.selectedStayTime.hour += Math.floor(sumTime / 60);
                this.selectedStayTime.minute = sumTime % 60;
            } else {
                this.selectedStayTime.minute += this.time_store[index].minute;
            }

        },

        handleDateChange(type) {
            const startDateInput = document.querySelector(".square-date:nth-of-type(1)");
            const endDateInput = document.querySelector(".square-date:nth-of-type(2)");
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            if (type === 'start') {
                this.selectedStartDate = startDateInput.value;
            } else if (type === 'end') {
                this.selectedEndDate = endDateInput.value;
                if (this.selectedStartDate && this.selectedEndDate) {
                    const startDate = new Date(this.selectedStartDate);
                    const endDate = new Date(this.selectedEndDate);
                    this.selectedStartDay = days[startDate.getDay()];
                    this.selectedEndDay = days[endDate.getDay()];
                    const timeDiff = endDate.getTime() - startDate.getTime();
                    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    if (endDate < startDate || diffDays >= 7) {
                        alert("일정 종료 날짜는 시작 날짜보다 이후이거나, 7일 이상 차이나면 안됩니다.");
                        // Reset end date
                        this.selectedEndDate = null;
                        endDateInput.value = '';
                    } else { this.selectedDiffDate = diffDays; this.selectedDiffHour = (diffDays + 1) * 24 }
                }
            }
        },

        modalClick() {
            if (this.selectedStartDate && this.selectedEndDate) { this.modalOpen = false }
            else alert('일정시작 날짜와 일정종료 날짜를 모두 입력하세요!')
        },

        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(this.mpLatLng.lat, this.mpLatLng.lng),
                level: 5,
            };

            //지도 객체를 등록합니다.
            //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
            this.map = new kakao.maps.Map(container, options);

            // 중간지점 마커생성
            this.middlePoint();
        },

        // 중간지점 마커 생성
        middlePoint() {
            const imageSrc = require('@/assets/중간지점.png');
            const imageSize = new window.kakao.maps.Size(50, 50);
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

            const coords = new window.kakao.maps.LatLng(this.mpLatLng.lat, this.mpLatLng.lng);
            const marker = new window.kakao.maps.Marker({
                position: coords,
                image: markerImage,
            });

            const infowindowContent = `
                <div style="padding:5px;font-size:12px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>중간 지점</strong></div>
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.mpBuildingName}</div>
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.meetPoint}</div>
                </div>`;
            const infowindow = new window.kakao.maps.InfoWindow({
                content: infowindowContent,
            });

            kakao.maps.event.addListener(marker, 'click', () => {
                if (this.infowindowOpened) { // 인포윈도우가 열려있다면
                    infowindow.close(); // 인포윈도우 닫기
                    this.infowindowOpened = false; // 열림 여부 변수 업데이트
                } else {
                    infowindow.open(this.map, marker);
                    this.infowindowOpened = true; // 열림 여부 변수 업데이트
                }
            });
            marker.setMap(this.map);
        },

        updateMapBounds() {
            if (this.addCheckInfoList.length === 0) return; //선택된 장소가 없을 시 종료
            const bounds = new kakao.maps.LatLngBounds(); //LatLngBounds 객체 생성
            //중간지점 마커를 포함한 모든 마커들을 boudns에 추가
            bounds.extend(new kakao.maps.LatLng(this.mpLatLng.lat, this.mpLatLng.lng));

            this.addCheckInfoList.forEach(info => { //addCheckList에 있는 각 주소에 대한 반복
                const address = info.location; //현재 주소 가져오기
                const geocoder = new window.kakao.maps.services.Geocoder(); // Geocoder 서비스 생성

                geocoder.addressSearch(address, (result, status) => { //주소로부터 좌표 검색
                    if (status === kakao.maps.services.Status.OK) {
                        // 검색된 좌표를 LatLng 객체로 변환
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        //검색된 좌표를 bounds에 추가
                        bounds.extend(coords);
                        //지도를 좌표에 맞게 업데이트
                        this.map.setBounds(bounds);
                    }
                });
            });
        },

        addCheckInfo(index) {
            if (this.addCheckInfoList.includes(this.selectInfo[index])) {
                //이미 선택된 정보인 경우 배열에서 제거
                const addCheckIndex = this.addCheckInfoList.indexOf(this.selectInfo[index]);
                this.addCheckInfoList.splice(addCheckIndex, 1);
                this.removeMarker(addCheckIndex); // 마커 제거
                this.removeInfowindow(addCheckIndex); // 인포윈도우 제거
                this.removeTime(addCheckIndex); // 머무르는 시간 제거
                this.updateDurations(); // 경과 시간 업데이트

            } else {
                //선택되지 않은 정보인 경우 배열에 추가
                this.addCheckInfoList.push(this.selectInfo[index]);
                this.addMarker(index);
                this.addTime(); // 머무르는 시간 (0시0분) 생성
                this.updateDurations();
            }
            this.updateMapBounds(); //체크박스 클릭 시 지도 업데이트
        },

        updateDurations() {
            // 선택된 리스트가 2개 이상일 경우 이전에 저장한 자차이동시간을 빼준다. 자차이동시간을 0으로 초기화 시킨다.
            if(this.addCheckInfoList.length > 1){
                if(this.selectedStayTime.minute - this.durationMinute < 0){
                    this.selectedStayTime.hour -= 1;
                    this.selectedStayTime.minute += 60; 
                }
                this.selectedStayTime.hour -= this.durationHour;
                this.selectedStayTime.minute -= this.durationMinute;
                this.durationhour = 0;
                this.durationMinute = 0;
            }
            //선택된 리스트가 2개 이상일 때만 경과 시간 계산
            for (let i = 0; i < this.addCheckInfoList.length -1; i++) {
                this.carTime(i); //경과 시간을 불러오기 위한 carTime함수 호출
            }
        },

        addMarker(index) {
            // 장소의 주소를 가져옴
            const address = this.selectInfo[index].location;

            // 카카오맵의 Geocoder 서비스를 이용하여 주소를 좌표로 변환
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 좌표를 생성합니다.
                    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다.
                    const marker = new kakao.maps.Marker({
                        map: this.map, // Vue 컴포넌트 내에서 map 객체에 접근할 수 있도록 변경
                        position: coords
                    });

                    // 인포윈도우로 장소에 대한 설명을 표시합니다.
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${this.selectInfo[index].name}</div>`
                    });
                    infowindow.open(this.map, marker);

                    // 마커 객체를 배열에 저장하여 추후 제거할 수 있도록 함
                    this.markers.push(marker);
                    this.infowindows.push(infowindow)

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다.
                    this.map.setCenter(coords);
                    // marker.setMap(this.map);
                }
            });
        },

        // 머무르는 시간 0시0분 생성
        addTime() {
            // 머무는 시간을 설정할 시 분 초기값
            const time = {
                hour: 2,
                minute: 0,
            }
            this.time_store.push(time);
            this.selectedStayTime.hour += time.hour;
            this.selectedStayTime.minute += time.minute;
        },

        removeMarker(index) {
            // 선택 해제된 장소의 마커 제거
            this.markers[index].setMap(null);
            this.markers.splice(index, 1);

        },
        removeInfowindow(index) {
            // 선택 해제된 장소의 마커 제거
            this.infowindows[index].close();
            this.infowindows.splice(index, 1);
        },

        // 머무르는 시간이 저장된 시간 제거
        removeTime(index) {
            // 삭제시 총 머무르는 시간에 해당 장소에 머무르는 시간을 빼기
            if (this.selectedStayTime.minute - this.time_store[index].minute < 0) {
                this.selectedStayTime.hour = (this.selectedStayTime.hour - 1) - this.time_store[index].hour;
                this.selectedStayTime.minute = this.selectedStayTime.minute + 60 - this.time_store[index].minute;
            } else {
                this.selectedStayTime.hour -= this.time_store[index].hour;
                this.selectedStayTime.minute -= this.time_store[index].minute;
            }
            this.time_store.splice(index, 1);
        },
        loadKakaoScript() {
            if (!window.Kakao || !window.Kakao.isInitialized()) {//window.Kakao 객체가 초기화 되지 않았다면
                const script = document.createElement('script');
                script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js';//카카오톡 공유를 위한 카카오 sdk 호출
                script.integrity = 'sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01';//스크립트 무결성 검증을 위한 해시 설정(없어도 됨)
                script.crossOrigin = 'anonymous';// 스크립트 보안 강화 기능(없어도 됨)
                script.onload = this.initKakaoShare;//스크립트 로드 시 initKakaoShare 함수 콜백
                document.head.appendChild(script);
            } else {
                //Kakao 객체가 초기화된 경우 initKakaoShare 함수 호출
                this.initKakaoShare();
            }
        },
        initKakaoShare() {
            //Kakao 객체 상태 확인
            if (window.Kakao && !window.Kakao.isInitialized()) {
                //Kakao 초기화
                window.Kakao.init('bf8710c35ec333b84272056c6f3d32e8');
            }
        },

        sharekakao(id) {
            const url = "http://localhost/ListPage.page?where=" + encodeURI(id) + // DB에 저장된 ID값
                "&startDate=" + this.selectedStartDate +  // 시작 날짜
                "&startDay=" + encodeURI(this.selectedStartDay) +  // 시작 요일
                "&endDate=" + this.selectedEndDate +  // 마지막 날짜
                "&endDay=" + encodeURI(this.selectedEndDay);     // 마지막 요일
            // Kakao 객체가 존재하고 초기화된 경우
            if (window.Kakao && window.Kakao.isInitialized()) {
                // 카카오 공유를 위한 content 객체 생성
                const content = {
                    title: '일정과 시간을 공유합니다.',
                    description: this.generateDescription(), //설명 생성 함수 호출
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    }
                }
                window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: content,
                    buttons: [
                        {
                            title: '웹으로 보기',
                            link: {
                                mobileWebUrl: url,
                                webUrl: url,
                            },
                        },
                    ],
                });
            }
        },

        //description 부분에 들어가는 내용 추가
        generateDescription() {
            let description = '';
            //각 체크인 정보를 반복하면서 설명 문자열 생성
            this.addCheckInfoList.forEach((info, index) => {
                description += `${index + 1}. 장소: ${info.name}\n`;
                description += `   주소: ${info.location}\n`;
                description += `   전화번호: ${info.phone}\n`;
                description += `   머무는 시간: ${this.time_store[index].hour}시간 ${this.time_store[index].minute}분\n\n`;
            });
            //머무는 시간 추가
            description += `총 머무는 시간: ${this.selectedStayTime.hour}시간 ${this.selectedStayTime.minute}분\n`;
            return description; // 생성된 설명 반환
        },

        // 세션스토리지에 저장된 데이터를 가져와서 초기값 설정
        getSessionStorageData() {
            this.meetPoint = sessionStorage.getItem("meetPoint");
            this.mpBuildingName = sessionStorage.getItem("buildingName");
            const mp = JSON.parse(sessionStorage.getItem("mpLatLng"));
            this.mpLatLng.lat = mp.lat;
            this.mpLatLng.lng = mp.lon;
            this.selectInfo = JSON.parse(sessionStorage.getItem("selectInfo"));
            // Wait until Vue updates the DOM
            this.$nextTick(() => {
                this.middlePoint();
            });
        },

        // DB에 조회할 인덱스 값을 통해 저장된 데이터 가져온 후 초기값 설정
        fetchPlaceData(index) {

            axios({
                method: 'post',
                header: { 'Content-Type': 'application/json; charset=UTF-8' },
                url: "/choice/selectPlace",
                data: { "index": index },
            })
                .then((response) => {
                    if (response.data) {
                        this.meetPoint = response.data.meetpoint;
                        this.mpBuildingName = response.data.mpbuildingname;
                        this.mpLatLng.lat = response.data.lat;
                        this.mpLatLng.lng = response.data.lon;
                        this.selectInfo = response.data.selectInfo;
                        // Wait until Vue updates the DOM
                        this.$nextTick(() => {
                            this.middlePoint();
                            this.selectShowMaker(response.data.addCheckInfoList);
                            this.selectedStayTime.hour = response.data.staytimehour;
                            this.selectedStayTime.minute = response.data.staytimeminute;
                        });
                    }
                })
                .catch(function () {
                    alert("데이터를 조회하는데 오류가 발생하였습니다.")
                })
        },

        // DB에 저장되어 있는 머무는 시간까지 선택한 장소를 지도에 마커로 표시
        selectShowMaker(places) {
            places.forEach((place) => {
                const time = {
                    hour: place.hour,
                    minute: place.minute
                }
                this.time_store.push(time);
                this.selectInfo.some((infoPlace, index) => {
                    if (place.name == infoPlace.name) {
                        let checked_box = document.getElementById('checkedBox' + index);
                        if (checked_box.checked == false) {
                            checked_box.checked = true;
                            this.addCheckInfo(index);
                        }
                    }
                });
            });
        },

        // 데이터 초기값 설정
        initializeData() {
            // 세션스토리지에 데이터 여부 확인
            if (sessionStorage.getItem("mpLatLng")) {
                this.getSessionStorageData();
            } else {
                this.modalOpen = false;
                const idx = decodeURIComponent(this.$route.query.where);
                this.selectedStartDate = this.$route.query.startDate;
                this.selectedStartDay = decodeURIComponent(this.$route.query.startDay);
                this.selectedEndDate = this.$route.query.endDate;
                this.selectedEndDay = decodeURIComponent(this.$route.query.endDay);
                const timeDiff = new Date(this.selectedEndDate).getTime() - new Date(this.selectedStartDate).getTime();
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                this.selectedDiffHour = (diffDays + 1) * 24
                this.fetchPlaceData(idx);
            }
        },
        carTime(index) {
            // Axios 요청 헤더 설정
            const axiosHeader = {
                'Authorization': 'KakaoAK 6bdf977aa54a27298dc04ae23f5b66ae',
                'Content-Type': 'application/json'
            }

            if (this.addCheckInfoList.length < 2 || index >= this.addCheckInfoList.length - 1) {
                alert("Invalid index or addCheckInfoList is undefined");
                return;
            }
            //선택한 장소 정보 가져옴
            const selectedPlace = this.addCheckInfoList[index];
            const selectedPlace2 = this.addCheckInfoList[index + 1];
            const origin = `${selectedPlace.placex},${selectedPlace.placey}`; // 출발지
            const destination = `${selectedPlace2.placex},${selectedPlace2.placey}`; //도착지
            const priority = "RECOMMEND"; // 경로 탐색 방법 (default : 추천경로 - RECOMMEND)

            const url = 'https://apis-navi.kakaomobility.com/v1/directions?origin=' + origin + '&destination=' + destination + '&priority=' + priority;

            // Axios 사용해서 get 요청 전송
            axios({
                method: 'get',
                headers: axiosHeader,
                url: url
            })
                .then((response) => {
                    //경로 탐색 응답이 있고, 하나 이상의 경로가 존재할 경우
                    if (response.data.routes && response.data.routes.length > 0) {
                        const route = response.data.routes[0]; //첫 번째 경로 선택
                        if (route.result_code == "0") { // 경로 탐색 성공했을 시
                            const durationInSeconds = route.summary.duration; //총 소요 시간을 초 단위로 저장
                            const durationInMinutes = Math.round(durationInSeconds / 60);

                            const hours = Math.floor(durationInMinutes / 60); 
                            const minutes = durationInMinutes % 60;
                            // 선택된 리스트에서 항목을 지울경우 자차이동시간 분(minute)을 빼기 위해 값을 저장
                            this.durationMinute += minutes
                            // 자차이동 분(minute)을 총 머무는 분(minute)에 저장
                            this.selectedStayTime.minute += minutes;
                            //durationTime 배열에 계산된 시간을 저장
                            if (hours > 0) { //시간 0일 때
                                this.durationTime[index] = `${hours} 시간 ${minutes} 분`;
                                // 선택된 리스트에서 항목을 지울경우 자차이동시간 시간(hour)을 빼기 위해 값을 저장
                                this.durationHour += hours;
                                // 자차이동 시간(hour)을 총 머무는 시간(hour)에 저장
                                this.selectedStayTime.hour += hours;
                            } else { //시간이 0이면 시간 생략
                                this.durationTime[index] = `${minutes} 분`;
                            }
                            // 만약 총 머무는 분(minute)가 59분 이상일 경우
                            if(this.selectedStayTime.minute > 59){
                                this.selectedStayTime.hour += (this.selectedStayTime.minute / 60);
                                this.selectedStayTime.minute %= 60; 
                            }
                        } else {
                            console.log(route.result_msg);
                            this.durationTime[index] = "도로탐색불가";
                        }
                    } else {
                        this.durationTime[index] = "도로탐색불가";
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.durationTime[index] = "도로탐색불가";
                });
        },
    },

    created() {

    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initializeData();
            this.initMap();
        } else {
            const script = document.createElement("script");
            /* global kakao */
            script.onload = () => {
                kakao.maps.load(() => {
                    this.initializeData();
                    this.initMap();
                });
            };
            script.src =
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services";
            document.head.appendChild(script);
        }
        this.loadKakaoScript();
        //초기화 후 지도 업데이트
        this.updateMapBounds();
    },

}
</script>

<style scoped>
.container {
    display: flex;
    /* position: relative; */
    text-align: center;
    align-items: center;
    width: 100%;
    height: 100%;

}

.modal-ctnt {
    background-color: #fefefe;
    border-radius: 10px;
    width: 30%;
    height: 35%;
    padding: 1.5em;
    box-shadow: 0px 0px 20px rgb(0, 0, 0, .2);
}

.modal-mid-text {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 1.5em;
}

.mulgeul {
    margin: 1.5em;
    font-size: 1.5em;
}

.planStart {
    margin-left: 5em;
    width: 100%;
}

.planEnd {
    width: 100%;
    margin-right: 5em;
}

.top-title {
    font-size: 2.5em;
    margin-top: 1em;
    margin-bottom: 1em;
}

.top-text {
    font-size: 1.5em;
    color: #a1a1a1a1;
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
    height: 20%;
}

.select-bttn {
    height: 60px;
    width: 100px;
    margin-top: 1em;
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

.map-wrap {
    display: flex;
    position: absolute;
    width: 40%;
    height: 100%;
    right: 0;
    z-index: 0;
}

#map {
    z-index: 0;
    width: 100%;
    height: 100%;
    position: relative;
}

.sidebar {
    display: flex;
    position: absolute;
    height: 100%;
    width: 60%;
    background-color: transparent;
    z-index: 1;
}

.side-left {
    display: flex;
    height: 100%;
    width: 10%;
    background-color: #7788ff;
    color: #fff;
    font-size: 1.5em;
    font-weight: 800;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 10;
}

.side-middle {
    height: 100%;
    width: 45%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 5;
    display: flex;
    flex-direction: column;
}

.selectDate>p {
    color: #35353575;
    font-size: 1em;
    /* position: fixed; */
}

.notScrollArea {
    flex: none;
    margin-bottom: 5%;
}

.scrollArea {
    overflow: auto;
    padding-top: 2%;
}

.side-rightMain {
    height: 100%;
    width: 45%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1;
    border-radius: 0px 10px 10px 0px;
    position: relative;
    display: flex;
    flex-direction: column;
}

.side-rightMain h2 {
    margin-bottom: 1em;
}

.side-right1,
.side-right2,
.side-right3,
.side-right4,
.side-right5,
.side-right6,
.side-right7 {
    height: 100%;
    width: 100%;
    z-index: 0;
    position: absolute;
    top: 2em;
}

.side-right2,
.side-right3,
.side-right4,
.side-right5,
.side-right6,
.side-right7 {
    visibility: hidden;
}

.step1,
.step2,
.step3 {
    margin-bottom: 20%;
}

.step1 {
    margin-top: 10%;
    height: 10%;
}

.step2 {
    height: 60%;
}

.step3 {
    height: 20%;
}

.selectDate {
    font-size: 2em;
    height: 10%;
    margin-top: 5%;
    cursor: pointer;
}

.meetPoint {
    margin-bottom: .3em;
}

.selectInfo {
    margin-bottom: 5%;
    display: flex;
    text-align: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width: 90%;
    height: 80px;
    padding: 1em;
    margin-left: 5%;
}

.infoWarper {
    width: 100%;
}

.infoWarper>h2,
h3{
    margin-left: 1em;
    text-align: left;
}
.infoWarper > a {
    text-align: left;
}

.infoWarper>h3 {
    color: #666666;
}

.scrollArea2 {
    overflow: auto;
    width: 100%;
    flex-grow: 1;
}
.acilWarp{
    height: 10%;
    width: 100%;
}
.addCheckInfoList {
    display: flex;
    /* text-align: center; */
    align-items: center;
    font-size: 1.5em;
    justify-content: space-between;
    width: 90%;
    height: 70%;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    margin-top: 5%;
    margin-left: 5%;
    overflow: auto;
    text-align: left;
    margin-bottom: 13px;
}

.infoList-left,
.infoList-right {
    display: flex;
    align-items: center;
}

.infoList-left {
    flex-grow: 1;
}
.timeSett{
    margin-left: 1em;
}
.infoList-right {
    flex-grow: 1;
    /* flex-direction: column; */
}

.rR {
    width: 70%;
}

.lL {
    width: 30%;
}

.lL>button {
    white-space: nowrap;
    font-size: 1em;
    font-weight: 700;
}


.side-rightMain>div>span {
    font-size: 2em;
    margin: 1em;
}


input[type="checkbox"] {
    cursor: pointer;
    z-index: 10;
    /* appearance: none;
    -webkit-appearance: none; */
    background-color: #666666;
}

.total-time {
    margin-top: 5%;
    font-size: 1.5em;
}

.durationTime{
    width: 50%;
    height: 30%;
    font-size: 1.5em;
    font-weight: 800;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    color: #5271ff;
    margin: auto;
}

/* 공유하기 */
.share_modal {
    /* 모달의 크기 조절 */
    width: 400px;
    height: 300px;
    /* 기타 스타일링 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.share-button {
    position: absolute;
    bottom: 10px;
    /* 조정 가능한 값 */
    right: 10px;
    /* 조정 가능한 값 */
}

.share-button button {
    width: 30px;
    /* 조정 가능한 값 */
    height: 30px;
    /* 조정 가능한 값 */
}

.share_img {
    width: 100%;
    /* 이미지 크기를 버튼에 맞춤 */
}

/* 미디어 쿼리 */
@media screen and (max-width: 1300px) {
    .modal-ctnt{
        width: 35%;
        height: 40%;
    }
}
@media screen and (max-width: 1050px) {
    .modal-ctnt{
        width: 90%;
        height: 50%;
    }
}

@media screen and (max-width: 1200px) {
    .side-left{ 
        font-size: 0;
        width: 3%;
    }
    .map-wrap{
        width: 44%;
    }
}

@media screen and (max-width: 1100px) {
    .sidebar{ width: 50%;}
    .map-wrap{ width: 54%;}
}

@media screen and (max-width: 1000px) {
    .sidebar{ width: 50%;}
    .side-middle{ display: none;}
    .map-wrap{ width: 76%;}
    .sidebar{ font-size: 1vw;}
    .side-rightMain{ width: 60%;}
}


</style>