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
                                    <a style="width: 71%"></a> <!--width의 비율만큼 별점이 정해짐-->
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

.PlaceItem .rating .backgroundStar {
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
    background-color: initial; */
}

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
</style>
