<template>
    <div class="container">
        <!--모달 창 (날짜 선택)-->
        <div class="modal-warper" v-if="modalOpen">
            <div class="modal-ctnt">
                <div class="modal-top">
                    <div class="top-title">일정을 선택해주세요!</div>
                    <div class="top-text">*일정은 <b>최대 10일</b>까지 선택 가능합니다*</div>
                </div>
                <div class="modal-mid">
                    <input type="date" name="" id="search-date" class="square-date"
                        :class="{ 'date-placeholder': startDate }" @change="handleDateChange">
                    <span>~</span>
                    <input type="date" name="" id="search-date" class="square-date"
                        :class="{ 'date-placeholder': endDate }" @change="handleDateChange">
                </div>
                <div calss="modal-btm">
                    <button class="select-bttn" @click="modalOpen = false">선택</button>
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
                시간설정 장소선택
            </div>
            <div class="side-right">

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
            modalOpen: true, //모달의 상태 여부
            startDate: true,
            endDate: true
        }
    },
    methods: {
        handleDateChange: function () {
            if (this.startDate) {
                this.startDate = false
            } else if (this.endDate) {
                this.endDate = false
            }
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
    },

    created() {

    },
    mounted() {
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

.modal-btm{
    height: 20%;
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

.map-wrap{
    display: flex;
    width: 60%;
    height: 100%;
}

#map {
    z-index: 0;
    width: 100%;
    height: 100%;
    position: relative;
}

.sidebar{
    display: flex;
    height: 100%;
    width: 40%;
    background-color: #5271ff;
    /* text-align: center;
    align-items: center; */
}

.side-left{
    display: flex;
    height: 100%;
    width: 14%;
    background-color: #fff;
    flex-direction: column;
}

.side-middle{
    height: 100%;
    width: 43%;
    background-color: orange;
}

.side-right{
    height: 100%;
    width: 43%;
    background-color: yellow;
}

.step1, .step2, .step3{
    margin-bottom: 20%;
    font-size: 1.5em;
}
</style>