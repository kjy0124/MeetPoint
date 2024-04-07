<template>
    <div class="container">
        <div class="background">
            <img class="background" src='@/assets/background.png'>
            <div class="warper">
                <div class="warper-top">
                    <h1>Meet Point</h1>
                    <h3>만날 장소를 결정하기 어려울 땐 Meet Point!</h3>
                </div>
                <div class="warper-mid">
                    <div class="warper-mid-top">
                        <ul>
                            <li v-for="(friend, index) in friendList" :key="index"
                                :class="{ 'with-border': index !== friendList.length }">
                                <div class="element-left">{{ friend.name.trim() !== '' ? friend.name : "친구" + (index + 1) }}
                                </div>
                                <div class="element-mid">{{ friend.address }}</div>
                                <img src="@/assets/x-circle.svg" class="element-right" @click="removeFriend(index)">
                            </li>
                        </ul>
                    </div>
                    <div class="warper-mid-btm">
                        <h3>친구는 최대 20명까지 추가할 수 있습니다!</h3>
                        <button class="add-button" @click="openModal()" :disabled="friendList.length >= 20">친구
                            추가하기</button>
                    </div>
                </div>
                <div class="warper-btm">
                    <form action="/MiddleMap.page">
                        <label>중간지점 계산 방식</label>
                        <select>
                            <option>무게중심</option>
                            <option>직선거리순</option>
                            <option >교통점수순</option>
                        </select>
                        <input class="submit-button" type="submit" value="중간지점 찾기">
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- 모달 창-->
    <div class="modal-warper" v-if="modalOpen">
        <div class="modal-content">
            <div class="modal-content-top">
                <img src="@/assets/caret-modal-fill.svg" alt="뒤로가기" @click="closeModal()" />
                <input class="input-name" placeholder="이름을 입력하세요!" type="text" id="name" v-model="name"
                    maxlength="17" />
                <button @click="getCurrentLocation">
                    <img src="@/assets/mylocation.svg" alt="현재 위치" />
                </button>
            </div>
            <div class="modal-content-btm">
                <div class="input-wrapper">
                    <input class="input-location" @input="handLeInput" placeholder="어디에서 출발하나요?" type="text" id="location"
                    v-model="location" maxlength="36" />
                    <!-- 장소 검색-->
                    <button @click="searchLocations">
                        <img class="search-img" src="../assets/돋보기.png" />
                    </button>
                </div>
                <div class="modal-content-btm-iner">
                    <div class="modal-address-list"> <!--장소 검색 구간과 겹쳐서 div 추가 생성하여 분리-->
                        <ul>
                            <li v-for="(place, index) in places" :key="index" @click="selectLocation(place)">
                                <div class="location-info">
                                    <div class="location-name">{{ place.place_name }}</div>
                                    <div class="location-detail-address">{{ place.address_name }}</div>
                                </div>
                            </li>
                        </ul>    
                    </div>
                </div>
            </div>
            <!-- <div class="modal-content-btm"></div> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'InputPage',
    data() {
        return {
            friendList: [], // 친구 목록을 관리할 배열
            modalOpen: false, //모달의 상태 여부
            name: '', // 사용자 이름 저장하는 변수
            location: '', // 모달 창에서 선택한 위치를 저장하는 변수
            places: [], //검색 결과 리스트
            nearbyPlaces: [], //주변 건물 
        };
    },
    methods: {
        /* 모달창을 여는 함수 */
        openModal() {
            this.modalOpen = true;
        },

        /* 모달창을 닫고 text영역을 초기화 하는 함수 */
        closeModal() {
            this.modalOpen = false;
            this.name = '';
            this.location = '';
            this.places = [];
        },

        /* 튜플 삭제 함수 */
        removeFriend(index) {
            this.friendList.splice(index, 1);
        },
        handLeInput() {
            this.location = event.target.value;
        },
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        //Kakao 지도 api 사용해서 현재 위치 주소 가져오기
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.coord2Address(longitude, latitude, (result, status) => {
                            if (status === window.kakao.maps.services.Status.OK) {
                                this.location = result[0].address.address_name;
                            } else {
                                console.error("Failed to get current location:", status);
                            }
                        });
                    },
                    (error) => {
                        console.error("Error getting current position:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        },
        searchLocations() {
            const placesSearch = new window.kakao.maps.services.Places();
            placesSearch.keywordSearch(this.location, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    this.places = result;
                    if (result.length > 0){ //장소 결과 길이가 0이상만 주변 장소 나옴
                        //검색된 장소 주변 건물 가져옴 
                        this.getNearbyPlaces(result[0].x, result[0].y);    
                    } else {
                        console.error("No places found for the given query.");
                    }
                } else {
                    console.error("Failed to search places:", status);
                    this.places = [];
                }
            });
        },
        selectLocation(place) {
            const name = this.name.trim() !== '' ? this.name : "친구" + (this.friendList.length + 1);
            this.friendList.push({ name: name, address: place.place_name });
            this.closeModal();
        },

        //모달 창에서 위치 선택 후 모달 닫기 및 위치 정보 저장
        closeModalAndSaveLocation(selectedLocation) {
            this.location = selectedLocation;
            this.closeModal();
        },

        getNearbyPlaces(x, y) {
            const placesSearch = new window.kakao.maps.services.Places();
            placesSearch.keywordSearch("주변", (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    this.nearbyPlaces = result;
                } else {
                    console.error("Failed to search nearby places:", status);
                }
            }, { x, y });
        },
    },
    mounted() {
        //kakao 지도 api 스크립트 로드
        const script = document.createElement("script");
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services,clusterer,drawing";
        script.onload = () => {
            window.kakao.maps.load(() => {
                console.log("Kakao Maps SDK loaded");
            });
        };
        window.onload = function(){document.head.appendChild(script);}
    }
}
</script>

<style>
.background {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    position: absolute;
}

.warper {
    width: 60%;
    height: 80%;
    background-color: rgba(255, 255, 255, .9);
    z-index: 20;
    display: flex;
    flex-direction: column;
    position: absolute;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    top: 10%;
    left: 20%;
    box-shadow: 0px 0px 20px rgb(0, 0, 0, .3);
}

.warper-top {
    width: 100%;
    height: 20%;
    padding-top: 10px;
}

.warper-mid {
    width: 85%;
    height: 65%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.warper-btm {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.warper-btm label{
    font-size: 1.5em;
}

.warper-top h1 {
    font-size: 4em;
    margin-top: 0.5em;
}

.warper-top h3 {
    margin-top: 1em;
    font-size: 2em;
    color: #a1a1a1a1;
    @media screen and (max-width: 1000px) {
        display: none;
    }
}

.warper-mid-top {
    width: 100%;
    height: 80%;
    font-size: 2rem;
    overflow-y: auto;
    /* border: rgba(82, 113, 255, 0.4) 2px solid; */
    border-radius: 1em;
    padding: 1em;
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); */
    
}

.with-border {
    display: flex;
    padding: 0.3em;
}

.warper-mid-top li {
    width: 100%;
}

.element-left {
    width: 20%;
    background-color: rgba(82, 113, 255, 0.9);
    border-radius: 1em;
    color: #fefefe;
    margin-right: 10%;
}

.element-mid {
    width: 50%;
    border: rgba(82, 113, 255, 0.4) 2px solid;
    border-radius: 1em;
    color: #5271ff;
}

.element-right {
    margin-left: 4em;
    width: 3%;
    cursor: pointer;
}

.warper-mid-btm {
    width: 100%;
    height: 20%;
}

.warper-mid-btm h3 {
    margin-top: 1em;
    font-size: 2em;
    color: #a1a1a1a1;
}

.add-button {
    color: #5271ff;
    font-size: 2em;
    border-radius: 10px;
    padding: 0.3em;
    margin-top: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.add-button:hover {
    background-color: rgb(82, 113, 255, .1);
}

.submit-button {
    border: none;
    background-color: transparent;
    font-size: 1.3rem;
    margin-left: 20px;
    cursor: pointer;
    color: #5271ff;
    font-size: 2em;
    border-radius: 10px;
    padding: 0.3em;
    margin-top: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3)


}

.submit-button:hover {
    background-color: rgb(82, 113, 255, .1);
    ;
}

.modal-warper {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
}

.modal-content {
    background-color: #fefefe;
    border-radius: 10px;
    width: 30%;
    height: 70%;
    padding: 1.5em;
    box-shadow: 0px 0px 20px rgb(0, 0, 0, .2);
}

.input-name{
    font-size: 1.7em !important;
    margin-left: 0.5em !important;
    margin-right: 0.5em;
    flex: 1;
}

.input-location{
    font-size: 1.7em !important;
    margin-left: 2.3em !important;
    margin-right: 0.5em;
}

.search-img{
    width: 2em;
    height: 2em;
}

.modal-content-top{
    margin-bottom: 1.5em;
    height: 5%;
}

.modal-content-mid{
    margin-left: 3em;
    height: 5%;
}

.modal-content-btm{
    /* margin-left: 4em; */
    /* width: 90%; */
    height: 90%;
    position: relative;
}

.modal-content-btm-iner{
    padding-left: 2.5em;
    margin-top: 1em;
    font-size: 1.7rem;
    overflow-y: auto;
    height: calc(100% - 40px);/* 입력 필드와 버튼 높이만큼 빼기 */
    /* border: 1px solid blue; */
}

/* ===================240407 css 추가======================= */

.location-name{
    margin-bottom: 0.3em;
    /* border-bottom: 1px solid #1c1c1c; */
    cursor: pointer;
    font-weight: bold;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 최대 두 줄까지 표시 */
    -webkit-box-orient: vertical;
    width: 100%;
    white-space: pre-line; /* 장소 이름 길면 2줄로 표시 */
    text-overflow: ellipsis;
    word-wrap: break-word; /* 장소 이름 길면 2줄로 표시 */
}

.location-detail-address {
    font-size: 1.4rem;
    color: #888;
    white-space: nowrap; /* 상세주소 줄변경 없이 한줄로 고정 */
    text-overflow: ellipsis;
    cursor: pointer;
    padding-right: 1em;
}

.location-info {
    display: flex;
    justify-content: space-between; /* 장소이름과 상세주소 같은 열&좌우 간격 */
}
.modal-address-list {
    margin-top: 0.5em;
    overflow-y: auto; /*스크롤 추가 */
}

.modal-address-list li {
    margin-bottom: 1em; /* 리스트 상하 줄 간격 */
}

.input-wrapper {
    position: sticky; /* 장소 검색 버튼 있는 곳 스크롤 되지 않도록 고정 */
    top: 0;
    background-color: #fefefe;
    z-index: 50;
    display: flex;
    align-items: center;
}
</style>