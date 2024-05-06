<template>
    <div class="container">
        <div class="list">
            <div class="list-top">
                <div @click="moveMainPage()"><img class="backCaret" src="@/assets/caret-left-fill.svg" /></div>
                <div class="logo">Meet &nbsp;Point</div>
            </div>
            <div class="info">
                <ul>
                    <li class="head_item">
                        <div class="head_item">
                            <strong class="tit_name">
                                <a href="#none" class="link_name"><strong>현대아울렛 대구점</strong></a>
                            </strong>
                            <span class="subcategory">상설할인매장</span>
                        </div>
                        <div data-id="rating" class="rating clickArea">
                            <span data-id="score" class="score">
                                <div class="rate">
                                    <span style="width: 71%"></span> <!--width의 비율만큼 별점이 정해짐-->
                                    <a href="https://place.map.kakao.com/1012120657#comment" data-id="numberofscore"
                                    class="numberofscore" target="_blank">36건</a>
                                </div>
                                
                            </span>
                            <span data-id="scoreGroove" class="groove"></span>
                            <a href="https://place.map.kakao.com/1012120657#review" data-id="review" class="review"
                                target="_blank">리뷰 <em data-id="numberofreview">57건</em></a>
                        </div>
                        <div class="info_item">
                            <div data-id="wrapAddress" class="addr">
                                <p data-id="address" title="대구 동구 동대구로 454">대구 동구 동대구로 454</p>
                                <p data-id="otherAddr" class="lot_number" title="신천동 294-5">(지번) 신천동 294-5</p>
                            </div>
                            <p data-id="gasinfo" class="gasinfo HIDDEN"></p>
                            <p data-id="realEstates" class="realEstates HIDDEN"></p>
                            <div data-id="openhour" class="openhour">
                                <p data-id="periodWarp" class="periodWarp">
                                    <span data-id="periodStatus" class="openhourTitle">영업중</span>
                                    <a data-id="periodTxt" href="https://place.map.kakao.com/1012120657?openhour=1"
                                        target="_blank">매일 10:30 ~ 21:00</a>
                                </p>
                            </div>
                            <div class="contact clickArea">
                                <span data-id="phone" class="phone">053-430-2233</span><span class="ICON-middot"></span>
                                <a href="https://place.map.kakao.com/1012120657" data-id="moreview" class="moreview"
                                    target="_blank">상세보기</a>
                                <span class="ICON-middot"></span><a
                                    href="http://www.ehyundai.com/newPortal/outlet/DP/DP000000_V.do?branchCd=B00176000"
                                    data-id="homepage" class="homepage" target="_blank">홈페이지</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn">
                <div class="list-bttm" @click="moveListPage()">일정 만들기<img class="backCaret"
                        src="@/assets/caret-right-fill.svg" /></div>
            </div>
        </div>
        <div class="map_wrap">
            <div id="map"></div>
            <!-- <div class="category">
                <div id="CT1" data-order="0">영화관</div>
                <div class="separator"></div>
                <div id="CE7" data-order="1">카페</div>
                <div class="separator"></div>
                <div id="FD6" data-order="2">음식점</div>
                <div class="separator"></div>
                <div id="PK6" data-order="3">주차장</div>
                <div class="separator"></div>
                <div id="CS2" data-order="4">편의점</div>
                <div class="separator"></div>
                <div id="AT4" data-order="5">관광명소</div>
                <div class="separator"></div>
                <div id="SW8" data-order="6">지하철</div>
                <div class="separator"></div>
                <div id="BK9" data-order="7">은행</div>
                <div class="separator"></div>
                <div id="OL7" data-order="8">주유소</div>
            </div> -->

            <!-- 네이버 지도 css를 참고하여 작성한 부분 -->
            <div class="category_ex">
                <!-- <ul class="list_bubble_filter">
                    <li>
                        <button @click="btnClick('food')" class="epehmC" :class="{ clicked: category_click.food }">음식점</button>
                    </li>
                    <li class="separator"></li>
                    <li>
                        <button @click="btnClick('cafe')" class="epehmC" :class="{ clicked: category_click.cafe }">카페</button>
                    </li>
                    <li class="separator"></li>
                    <li>
                        <button @click="btnClick('pension')" class="epehmC" :class="{ clicked: category_click.pension }">펜션</button>
                    </li>
                    <li class="separator"></li>
                    <li>
                        <button @click="btnClick('paking')" class="epehmC" :class="{ clicked: category_click.paking }">주차장</button>
                    </li>
                    <li class="separator"></li>
                    <li>
                        <button @click="btnClick('coupon')" class="epehmC" :class=" { clicked: category_click.coupon }">쿠폰</button>
                    </li>
                    <li class="separator"></li>
                    <li>
                        <button @click="btnClick('order')" class="epehmC" :class="{ clicked: category_click.order }">주문</button>
                    </li>
                </ul> -->
                <ul class="list_bubble_filter">
                    <li v-for="(category, index) in categories" :key="index">
                    <button @click="btnClick(category)" class="epehmc" :class="{ clicked: category_click[category.id] }">
                        <span :class="`category_click.bg ${category.id}`"></span>
                        {{ category.name }}
                    </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
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
            },
            categories: [
                { id: "BK9", name: "은행" },
                { id: "MT1", name: "마트" },
                { id: "SC4", name: "학교"},
                { id: "CS2", name: "편의점" },
                { id: "FD6", name: "음식점"},
                { id: "CE7", name: "카페" },
                // { id: "CT1", name: "영화관" },
                { id: "AD5", name: "숙박" },
                { id: "OL7", name: "주유소" },
                // { id: "HP8", name: "병원"},
                // { id: "PM9", name: "약국" },
                // { id: "SW8", name: "지하철역"},
            ],
            markers: [] // 마커 배열
        };
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
        
        btnClick(category) {
            //기존에 떠있는 마커들 모두 제거
            this.markers.forEach(marker => marker.setMap(null));
            //저장된 마커 제거
            this.markers.splice(0, this.markers.length);

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
            //먼저 현재 위치로 이동
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locPosition = new window.kakao.maps.LatLng(lat, lng);
                    this.map.setCenter(locPosition);

                    //카카오맵 장소 검색 서비스 생성
                    const placesService = new window.kakao.maps.services.Places();
                    
                    // 검색결과 반환받을 함수
                    var callback = function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            this.saveMarkersByCategory(result, target_category);
                        } else {
                            console.error('장소 검색에 실패했습니다:', status);
                        }
                    }.bind(this);

                    // 주변 장소 검색 요청
                    placesService.categorySearch(target_category.id, callback, {
                        location: locPosition,
                        radius: 10000,
                        useMapCenter: false
                    });
                });
            } else {
                console.error('Geolocation이 지원되지 않습니다.');
            }
        },
        saveMarkersByCategory(result, target_category) {
            //마커 정보 추출 place에 다량의 정보 함축되어있음
            result.forEach(place => {
                const mapCategory = place.category_group_code;
                const marker = new window.kakao.maps.Marker({
                    map: this.map,
                    position: new window.kakao.maps.LatLng(place.y, place.x),
                    title: place.place_name, //마커에 표시될 타이틀 설정
                    category: mapCategory //카테고리 정보 저장
                });
                //마커 클릭 이벤트 등록(24.04.29 수정)
                window.kakao.maps.event.addListener(marker,'click',() => {
                    //현재 열려있는 정보 창이 있다면 닫기
                    if(this.infowindow) {
                        this.infowindow.close();
                    }

                    //새로운 정보 창 열기
                    this.infowindow = new window.kakao.maps.InfoWindow({
                        content: `
                            <div style="padding:5px;font-size:12px;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>${place.place_name}</strong></div>
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">(지번: ${place.road_address_name || place.address_name})</div>
                                <div style="margin-top: 5px;color: #5271ff;">${place.phone}</div>
                                <div style="margin-top: 5px;"><a href="${place.place_url}" target="_blank">상세보기</a></div>
                            </div>`
                    });
                    this.infowindow.open(this.map, marker);
                })//24.04.29 추가완료

                //생성한 마커를 markers 배열에 추가
                this.markers.push(marker);
            });
            //마커 띄우기
            this.showMarkersByCategory(target_category.id);
        },
        showMarkersByCategory(category) {
            //선택한 카테고리에 해당하는 마커만 지도에 표시
            const markers = this.markers.filter(marker => {marker.category == category});
            markers.forEach(marker => marker.setMap(this.map));
        }
    },
    created() {
        //category_click 객체 초기화
        for(let key in this.category_click) {
            this.category_click[key] = false;
        }
    },
    mounted() {
        const script = document.createElement("script");
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=bf8710c35ec333b84272056c6f3d32e8&libraries=services,clusterer,drawing";
        script.onload = () => {
            window.kakao.maps.load(() => {
                this.initMap();
            });
        };
        document.head.appendChild(script);
    },

}
</script>

<style>
.container {
    display: flex;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    /*스크롤 바가 없어지고 동시에 스크롤 기능도 없어짐 */
}

.list {
    position: relative;
    width: 25%;
    height: 100%;
    border-right: 1px solid black;
}

.logo {
    height: 10%;
    font-size: 60px;
    font-weight: 400px;
    font-style: normal;
    color: white;
    margin-left: 10px;
    /* text-align: center; */
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    width: 80%;
}

.backCaret {
    width: 50px;
    height: 50px;
    margin-left: 15px;
    cursor: pointer;
}

.info {
    height: 80%;
    /* border-bottom: 1px solid black; */
}

.btn {
    height: 11%;
    display: flex;
    justify-content: center;
    /* 수평 가운데 정렬 */
    align-items: center;
    /* 수직 가운데 정렬 */

}

#map {
    width: 75%;
    height: 100%;
}

.list-top {
    display: flex;
    background: linear-gradient(to right, #5de0e6 30%, #004aad);
    justify-content: center;
    align-items: center;
}

/* .PlaceItem .rating .backgroundStar {
    width: 68px;
    margin: 2px 3px 0 0;
    background-position: 0 0;
}

.PlaceItem .rating .star {
    background-position: 0 -20px;
}

.PlaceItem .rating .backgroundStar,
.PlaceItem .rating .star {
    overflow: hidden;
    float: left;
    height: 12px;
    background: url(//t1.daumcdn.net/localimg/localimages/07/2018/pc/placeItem/ico_star.png) no-repeat;
    background-image: url(//t1.daumcdn.net/localimg/localimages/07/2018/pc/placeItem/ico_star.png);
    /* background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-repeat: no-repeat;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: initial; 
} */

.list-bttm {
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, #5de0e6 30%, #004aad);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    font-weight: 400px;
    cursor: pointer;
}

ul {
    list-style: none;
}

.head_item {
    text-align: left;
}

.tit_name {
    text-align: left;
}

.link_name {
    text-decoration-line: none;
    color: inherit;
}

.numberofscore,
.numberofreview {
    text-decoration-line: none;
    color: black;
}

.subcategory {
    margin-left: 10px;
    color: gray;
    font-size: 13px;
}

.rate {
    background: url(https://aldo814.github.io/jobcloud/html/images/user/star_bg02.png) no-repeat;
    width: 121px;
    height: 20px;
    position: relative;
}

.rate span {
    position: absolute;
    background: url(https://aldo814.github.io/jobcloud/html/images/user/star02.png);
    width: auto;
    height: 20px;
}

/* 지도 */
.map_wrap {
    width: 75%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
}

#map {
    width: 100%;
    height: 100%;
}


/* 카테고리 */
.category{
    display: flex;
    color: white;
    align-items: center;
    margin-left: 10%;
    width: 80%;
    height: 7%;
    position: absolute;
    border: 1px solid black;
    border-radius: 5px;
    top: 15px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    background: linear-gradient(to right, #5de0e6 30%, #004aad);

    
}
.separator {
    width: 2px; /* 선의 너비 설정 */
    height: 20px; /* 선의 높이 설정 */
    background-color: rgb(36, 36, 36); /* 선의 색상 설정 */
    margin: 0 10px; /* 선과 요소 사이의 간격 설정 */
}

.category div {
    margin: 0, 5px;
}

/* .category div {
    border: 1px solid red;
    text-align: center;
    display: inline-flex;
    width: 10%;
    height: 100%;
    line-height: 60px;
    color: #fff;
} */

/* 카테고리 - 네이버 지도 css를 참고하여 작성한 부분 */
.category_ex {
    position: absolute;
    left: 22px;
    top: 15px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    background: padding-box padding-box rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px 0px;
    white-space: nowrap;
    z-index: 1;
}

.category_ex .list_bubble_filter {
    padding: 0px 11px;
}

.category_ex .list_bubble_filter li {
    display: inline-block;
    vertical-align: top;
}

li {

    list-style: none;
    text-align: -webkit-match-parent;
}
li button {
    cursor: pointer;
    border: 0px;
    border-radius: 0px;
    background-color: transparent;

}

.epehmC {
    position: relative;
    padding: 0px 11px 0px;
    line-height: 9.5px;
    font-size: 15px;
    font-weight: 600;
    color: rgb(36, 36, 36);
}
.clicked{
    color: #1a73e8;
    /* border-bottom: 3px solid #1a73e8; */ /* 글자 클릭시 글자 아래부분 밑줄 생성 */
    /* padding-bottom: 8px; */
    /* border-right: 3px solid #1a73e8; */
    
}
/**********************************************/
</style>
