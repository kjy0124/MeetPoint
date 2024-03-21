<template>
    <div class="container">
        <div class="list">
            <div class="list-top">
                <div @click="moveMainPage()"><img class="backCaret" src="@/assets/caret-left-fill.svg"/></div>
                <div class="logo">Meet Point</div>
            </div>
            <div class="info">
                <ul>
                    <li>
                        <div>
                            <span>현대아울렛 대구점</span>
                            <!-- <a href="#none" data-id="fav" class="fav">
                                <span class="ico_fav">즐겨찾기</span><span class="num"></span>
                            </a>
                            <a href="#none" data-id="roadview" class="roadview">로드뷰</a> -->
                            <button type="button">길찾기</button>
                        </div>
                        <div class="head_item clickArea">
                            <strong class="tit_name">
                                <a href="#none" data-id="icon" class="link_order clickArea">A</a>
                                <a href="#none" data-id="name" class="link_name" title="현대아울렛 대구점"><strong>현대아울렛
                                        대구점</strong></a>
                            </strong>
                            <span data-id="subcategory" class="subcategory clickable">상설할인매장</span>
                        </div>
                        <div data-id="rating" class="rating clickArea">
                            <span data-id="score" class="score">
                                <span class="screen_out">별점</span>
                                <em data-id="scoreNum" class="num" title="3.4점">3.4</em>
                                <span class="backgroundStar">
                                    <span data-id="star" class="star" style="width: 46.24px;"></span>
                                </span>
                                <a href="https://place.map.kakao.com/1012120657#comment" data-id="numberofscore"
                                    class="numberofscore" target="_blank">36건</a>
                            </span>
                            <span data-id="scoreBlind" class="txt_blind HIDDEN"><span class="ico_noti"></span>후기
                                미제공</span>
                            <span data-id="scoreGroove" class="groove"></span>
                            <a href="https://place.map.kakao.com/1012120657#review" data-id="review" class="review"
                                target="_blank">리뷰 <em data-id="numberofreview">57</em></a>
                            <span data-id="tvshowInfo" class="tvinfolabel HIDDEN">tv소개</span>
                        </div>
                        <div class="info_item">
                            <div data-id="wrapCourseInfo" class="wrapCourseInfo HIDDEN"></div>
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
                <button class="works_button" @click="moveListPage()">일정 만들기 ></button>
            </div>
        </div>
        <div id="map"></div>
    </div>
</template>

<script>

export default {
    name: "KakaoMap",
    data() {
        return {
            map: null,
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
.container {
    display: flex;
    align-items: center;
    height: 100vh;
    overflow: hidden; /*스크롤 바가 없어지고 동시에 스크롤 기능도 없어짐 */
}

.list {
    position: relative;
    width: 25%;
    height: 100%;
    border-right: 1px solid black;
}

.list .logo {
    height: 10%;
    font-size: 60px;
    text-align: center;
    font-weight: 400px;
    font-style: normal;
}

.logo{
    color: white;
    margin-left: 30px;
}

.backCaret{
    width: 50px;
    height: 50px;
    margin-right: 30px;
}

.list .info {
    height: 80%;
    /* border-bottom: 1px solid black; */
}

.list .btn {
    height: 10%;
    display: flex;
    justify-content: center;
    /* 수평 가운데 정렬 */
    align-items: center;
    /* 수직 가운데 정렬 */

}

.btn button {
    width: 80%;
    height: 80%;
    background-color: #0a0a23;
    /* 버튼 배경색 */
    color: #fff;
    /* 버튼 텍스트 색상 */
    border: none;
    border-radius: 25px;
    font-size: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.list button:hover {
    background-color: #002ead;
    /* 마우스 호버 시 버튼 배경색 변경 */
    transition: 0.7s;
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

.works_button {
    display: inline-block;
    width: 100%;
    height: 45px;
    border: none;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    background: linear-gradient(to bottom, #6164c4, #36b2cd);
    position: relative;
    overflow: hidden;
}

.works_button::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
}

.works_button:hover::before {
    transform: translateY(0);
}

.works_button:hover {
    background: linear-gradient(to bottom, #36b2cd, #6164c4);
}

.PlaceItem .rating .backgroundStar {
    width: 68px;
    margin: 2px 3px 0 0;
    background-position: 0 0;
}

.PlaceItem .rating .star {
    background-position: 0 -20px;
}

.PlaceItem .rating .backgroundStar, .PlaceItem .rating .star {
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
    background-color: initial; */
}
</style>
