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
            </div>
            <div class="side-middle">
                <div class="notScrollArea">
                    <div @click="modalOpen = true" class="selectDate">
                        <h2 class="meetPoint">{{ meetPoint }}</h2>
                        <p v-if="!selectedEndDate || !selectedStartDate">일정을 입력해주세요!</p>
                        <p v-if="selectedStartDate && selectedEndDate">{{ selectedStartDate + '(' +
                            this.selectedStartDay +
                            ')' }}
                            ~ {{ selectedEndDate + '(' + this.selectedEndDay + ')' }}</p>
                    </div>
                </div>
                <div class="scrollArea">
                    <div class="selectInfo" v-for="(info, i) in selectInfo" :key="i">
                        <input class="checkBox" type="checkbox" @change="addCheckInfo(i)">
                        <div class="infoWarper">
                            <h2>{{ info.placeName }}</h2>
                            <h3>{{ info.placeAddress }}</h3>
                            <h3>{{ info.placeCallNum }}</h3>
                            <a href="">상세보기</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div v-for="(DiffDate, i) in selectedDiffDate+1" :key="i" :class="[`side-right${i+1}`]" ></div> -->
            <div class="side-rightMain">
                <p>{{ '/ ' + selectedDiffHour + '시간 0분' }}</p>
                <div v-for="(info, i) in addCheckInfoList" :key="i" class="addCheckInfoList">
                    <p>{{ i + 1 }}</p>
                    <h3>{{ info.placeName }}</h3>
                    <button>dd</button>
                </div>
            </div>
        </div>
        <div class="map-wrap">
            <div id="map"></div>
        </div>
    </div>

</template>

<script>

export default {
    name: "ListPage",
    data() {
        return {
            modalOpen: false, //모달의 상태 여부
            selectedStartDate: null, //일정 시작 날짜
            selectedStartDay: null, //일정 시작 날짜 요일
            selectedEndDate: null, //일정 종료 날짜
            selectedEndDay: null, //일정 종료 날짜 요일
            selectedDiffDate: null, //일정 일수 차이 값
            selectedDiffHour: null, //총 일정 수의 시간 값
            meetPoint: '동성로', //이전 페이지의 중간지점 주소
            selectInfo: [ //이전 페이지에서 체크박스 선택한 장소들의 오브젝트
                {
                    placeName: '서문시장',
                    placeAddress: '대구 중구 큰장로26길 45',
                    placeCallNum: '053-356-6944'
                },
                {
                    placeName: '스파크 랜드',
                    placeAddress: '대구 중구 동성로6길 61',
                    placeCallNum: '053-230-2010'
                },
                {
                    placeName: 'CGV 대구한일',
                    placeAddress: '대구 중구 동성로 39 씨네시티한일 7층',
                    placeCallNum: '1544-1122'
                },
                {
                    placeName: '전원돈까스',
                    placeAddress: '대구 중구 동성로6길 2-23',
                    placeCallNum: '053-424-8220'
                },
                {
                    placeName: '엘디스리젠트호텔',
                    placeAddress: '대구 중구 달구벌대로 2033',
                    placeCallNum: '053-235-7711'
                },
                {
                    placeName: '서문시장',
                    placeAddress: '대구 중구 큰장로26길 45',
                    placeCallNum: '053-356-6944'
                },
                {
                    placeName: '스파크 랜드',
                    placeAddress: '대구 중구 동성로6길 61',
                    placeCallNum: '053-230-2010'
                },
                {
                    placeName: 'CGV 대구한일',
                    placeAddress: '대구 중구 동성로 39 씨네시티한일 7층',
                    placeCallNum: '1544-1122'
                },
                {
                    placeName: '전원돈까스',
                    placeAddress: '대구 중구 동성로6길 2-23',
                    placeCallNum: '053-424-8220'
                },
                {
                    placeName: '엘디스리젠트호텔',
                    placeAddress: '대구 중구 달구벌대로 2033',
                    placeCallNum: '053-235-7711'
                },
            ],
            addCheckInfoList: [], // 체크한 장소 정보를 담을 배열 추가
            markers: [],
            infowindows: [],
        }
    },
    methods: {
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
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 5,
            };

            //지도 객체를 등록합니다.
            //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
            this.map = new kakao.maps.Map(container, options);
        },

        addCheckInfo(index) {
            if (this.addCheckInfoList.includes(this.selectInfo[index])) {
                //이미 선택된 정보인 경우 배열에서 제거
                const addCheckIndex = this.addCheckInfoList.indexOf(this.selectInfo[index]);
                this.addCheckInfoList.splice(addCheckIndex, 1);
                this.removeMarker(index); // 마커 제거
                this.removeInfowindow(index); // 인포윈도우 제거

            } else {
                //선택되지 않은 정보인 경우 배열에 추가
                this.addCheckInfoList.push(this.selectInfo[index]);
                this.addMarker(index);

            }
            console.log("마커배열", this.markers);
        },

        addMarker(index) {
            // 장소의 주소를 가져옴
            const address = this.selectInfo[index].placeAddress;

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
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${this.selectInfo[index].placeName}</div>`
                    });
                    infowindow.open(this.map, marker);

                    // 마커 객체를 배열에 저장하여 추후 제거할 수 있도록 함
                    this.markers.push(marker);
                    this.infowindows.push(infowindow)

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다.
                    this.map.setCenter(coords);
                    // marker.setMap(this.map);
                    console.log(coords);
                }
            });
        },

        removeMarker(index) {
            // 선택 해제된 장소의 마커 제거
            if (this.markers.length > index && this.markers[index]) {
                this.markers[index].setMap(null);
                this.markers.splice(index, 1);
            }
        },
        removeInfowindow(index) {
            // 선택 해제된 장소의 마커 제거
            if (this.infowindows.length > index && this.infowindows[index]) {
                this.infowindows[index].setMap(null);
                this.infowindows.splice(index, 1);
            }
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
            script.onload = () => window.kakao.maps.load(this.initMap);
            script.src =
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services";
            document.head.appendChild(script);
            console.log("kakao mounted");
        }
    },

}
</script>

<style scoped>
.container {
    display: flex;
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
    width: 40%;
    height: 100%;
    margin-left: auto;
}

#map {
    z-index: 0;
    width: 100%;
    height: 100%;
    position: relative;
}

.sidebar {
    display: flex;
    height: 100%;
    width: 60%;
    background-color: transparent;

    /* text-align: center;
    align-items: center; */
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
.notScrollArea{
    flex: none;
}
.scrollArea{
    overflow: auto;
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
    height: 10%;
    padding: 1em;
    margin-left: 5%;
}

.infoWarper {
    width: 100%;
}

.infoWarper>h2,
h3,
a {
    margin-left: 1em;
    text-align: left;
}

.infoWarper>h3 {
    color: #666666;
}

.checkBox {
    display: flex;
}

.side-rightMain>div>span {
    font-size: 2em;
    margin: 1em;
}

.addCheckInfoList {
    display: flex;
    text-align: center;
    align-items: center;
    font-size: 1.5em;
    justify-content: center;

}
</style>