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
                                <div class="element-left">{{ friend.name.trim() !== '' ? friend.name : "친구"+(index+1) }}</div>
                                <div class="element-mid">{{ friend.address }}</div>
                                <img src="@/assets/x-circle.svg" class="element-right" @click="removeFriend(index)">
                            </li>
                        </ul>
                    </div>
                    <div class="warper-mid-btm">
                        <h3>친구는 최대 20명까지 추가할 수 있습니다!</h3>
                        <button class="add-button" @click="openModal()" :disabled="friendList.length >= 20">친구 추가하기</button>
                    </div>
                </div>
                <div class="warper-btm">
                    <form action="/MiddleMap.page">
                        <label>중간지점 계산 방식</label>
                        <select>
                            <option>무게중심</option>
                            <option>직선거리순</option>
                            <option>교통점수순</option>
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
                <input class="input-name" placeholder="이름을 입력하세요!" type="text" id="name" v-model="name" maxlength="17"/>
                <button @click="getCurrentLocation">
                    <img src="@/assets/mylocation.svg" alt="현재 위치" />
                </button>
            </div>
            <div class="modal-content-btm">
                <input 
                    class="input-location" 
                    @input="handLeInput"
                    placeholder="어디에서 출발하나요?" 
                    type="text" 
                    id="location" 
                    v-model="location" 
                    maxlength="36"/>
                <!-- 장소 검색-->
                <button @click="searchLocations">
                    <img class="search-img" src="../assets/돋보기.png" />
                </button>
                <div class="modal-content-btm-iner">
                    <ul>
                        <li v-for="(place, index) in places" :key="index" @click="selectLocation(place)">
                            <div class="location-name">{{ place.place_name }}</div>
                            <div class="location-address">{{ place.place_address }}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <div class="modal-content-btm"></div> -->
        </div>
    </div>
</template>
<script>
export default {
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
                    //검색된 장소 주변 건물 가져옴 
                    this.getNearbyPlaces(result[0].x, result[0].y);
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
            document.head.appendChild(script);
    }
}
</script>

<style>
@import "/src/css/InputPage.css";
</style>