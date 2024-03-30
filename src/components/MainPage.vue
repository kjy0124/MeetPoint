<template>
  <div class="main">
    <img
      class="background-image"
      alt="background"
      src="@/assets/background.png"
    />
    <div class="rounded-box">
      <div class="main-box">
        <h1>Meet Point</h1>
        <h3 style="color: lightgray">
          이름과 위치를 입력하고 원하는 방식으로 중간지점을 검색하세요!
        </h3>
        <div class="info-box">
          <section
            style="padding: 0px; margin: auto; width: 30%; padding-left: 50px"
          >
            <div>
              <input
                class="input-text"
                placeholder="이름을 입력하세요!"
                type="text"
                v-model="name"
              />
            </div>
            <div style="height: 30px"></div>
            <div class="searchWrap">
              <input
                class="search-input-text"
                placeholder="위치를 입력하세요!"
                type="text"
                v-model="location"
                @click="openModal()"
              />
              <!-- <button class="searchBtn"></button> -->
              <img src="../assets/돋보기.png" @click="openModal" />
            </div>
          </section>
          <section style="width: 25%" class="playbuttonsec">
            <input class="playbutton" type="button" @click="saveData()" />
          </section>
          <section style="padding-right: 20px; margin: 10px; width: 40%">
            <table class="list-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>위치</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.location }}</td>
                  <td>
                    <svg
                      @mouseover="changeColor(true)"
                      @mouseleave="changeColor(false)"
                      @click="Delete(index)"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                    <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
            <button class="works_button" @click="move()">중간지점 찾기</button>
          </section>
        </div>
      </div>
    </div>
    <!-- 모달 창-->
    <div class="rounded-box" v-if="modalOpen">
      <div class="modal_main-box">
        <div @click="closeModal()">
          <img class="modal_backCaret" src="@/assets/caret-modal-fill.svg" />
        </div>

        <!--내 현재 위치 버튼-->
        <button @click="getCurrentLocation">
          <img class="nowAddress" src="@/assets/mylocation.svg" alt="현재 위치" />
        </button>

        <!--현재 위치 버튼 클릭 시 텍스트 상에 표시-->
        <input
          class="modal_Place_Name"
          type="text"
          v-model="query"
          @input="handLeInput"
          placeholder="장소 검색"
        /><!--장소 입력-->

        <!--검색 이미지 버튼-->
        <button @click="searchPlaces">
          <img class="searchPlace" src="@/assets/돋보기.png" alt="검색" />
        </button>

        <div class="modal_info-box">
          <div class="modal_list">
            <ul>
              <li v-for="(place, index) in places" :key="index" @click="selectPlace(place)">
                <div class="modal_location">{{ place.place_name }}</div>
                <div class="modal_address">{{ place.address_name }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "MainPage",
  data() {
    return {
      modalOpen: false, // 모달 상태를 저장하는 데이터
      fillColor: "currentColor", // 초기 fill 색상 설정
      currentLocation: "", //현재 위치 텍스트
      query: "", //검색어
      places: [], //검색 결과 리스트
      nearbyPlaces: [],
      items: [],
      name: '', // 사용자 이름 저장하는 변수
      location: '', // 모달 창에서 선택한 위치를 저장하는 변수
      dataList: [], // 저장된 리스트
    };
  },
  methods: {
    /* 중간지점 찾기 버튼 클릭시 두번째 페이지로 이동 */
    move() {
      this.$router.push({ name: "KakaoMap", params: {} }); // router.push( {path : '/KakaoMap.page', query: {} });
    },

    //위치 input box 클릭 시 모달 창 열기
    openModal() {
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
    },
    selectPlace(place) {
      this.location = place.place_name; // 선택된 장소 이름으로 위치 입력창 값을 설정
      this.modalOpen = false; // 모달 닫기
    },

    //모달 창에서 위치 선택 후 모달 닫기 및 위치 정보 저장
    closeModalAndSaveLocation(selectedLocation) {
      this.location = selectedLocation;
      this.closeModal();
    },
    // playbuttoon 클릭 시 데이터 저장
    saveData() {
      if (this.name && this.location) {
        this.dataList.push({ name: this.name, location: this.location });
        this.items.push({ name: this.name, location: this.location });
        this.name = '';
        this.location = '';
      } else {
        alert('이름과 위치를 모두 입력해주세요.');
      }
    },


    /* 삭제 버튼 */
    Delete() {
      alert("삭제");
    },

    /* x버튼에 마우스 올려두면 색상 변경 */
    changeColor(isHovered) {
      if (isHovered) {
        this.fillColor = "#fff"; // 마우스 오버 시 색상 변경
      } else {
        this.fillColor = "currentColor"; // 마우스 떠날 시 원래 색상으로 변경
      }
    },
    handLeInput() {
      this.query = event.target.value;
    },
    //현재 위치 가져오기
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
                this.query = result[0].address.address_name;
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
    //장소 검색 실행
    searchPlaces() {
      //Kakao 지도 API 사용해서 검색
      const placesSearch = new window.kakao.maps.services.Places();
      placesSearch.keywordSearch(this.query, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          this.places = result;
          // 검색된 장소 주변의 건물들을 가져옴
          this.getNearbyPlaces(result[0].x, result[0].y);
        } else {
          console.error("Failed to search places:", status);

          this.places = [];
        }
      });
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

  created() {},
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
  },
};
</script>
  
  <style>
.main {
  width: 100%;
  height: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.rounded-box {
  width: 65%;
  height: 85%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 7%;
  left: 17%;
  z-index: 2;
}

.main-box {
  width: 98%;
  height: 97%;
  background-color: white;
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  position: absolute;
  z-index: 3;
}

.info-box {
  width: 90%;
  height: 70%;
  background: linear-gradient(to right, #cdffd8 30%, #94b9ff);
  border-radius: 1%;
  z-index: 4;
  display: flex;
  padding: 0;
}

.playbutton {
  background: url("../assets/재생버튼.png") no-repeat;
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-width: 0;
}

/* 이름 입력하는 부분 */
.input-text {
  border-width: 0;
  height: 30px;
  font-size: 20px;
  width: 93%;
  border-radius: 5px;
  padding: 1px 35px 1px 5px;
}

/* 위치 입력하는 부분 */
.searchWrap {
  position: relative;
  width: 93%;
}
/* 위치 입력하는 부분 */
.search-input-text {
  border-width: 0;
  height: 30px;
  font-size: 20px;
  width: 100%;
  border-radius: 5px;
  padding: 1px 35px 1px 5px;
}
/* 위치 입력하는 돋보기 부분 */
.searchWrap img {
  position: absolute;
  top: 0;
  right: -35px;
  width: 30px;
  height: 30px;
  background: url(../assets/돋보기.png);
  border: none;
  outline: none;
  cursor: pointer;
}

.list-table {
  border-bottom: 2px solid #7a97f7;
  border-collapse: collapse;
  width: 100%;
  height: 60%;
  margin: 20px 0;
}

.list-table th,
.list-table td {
  text-align: center;
}

.list-table th,
.list-table td {
  border-top: 2px solid #7a97f7;
  border-collapse: collapse;
}

.list-table thead th {
  background-color: #dbe3fb;
  color: #213f99;
}

.list-table td:empty {
  visibility: hidden; /* 빈 셀의 내용을 숨김 */
}

.list-table td:empty::before {
  content: "\00a0"; /* 빈 셀에 내용이 없을 때 공간 유지 */
}

.playbuttonsec {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.works_button {
  display: inline-block;
  width: 100%;
  height: 55px !important;
  border: none;
  border-radius: 5px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  background: linear-gradient(to left, #6164c4, #36b2cd) !important;
  position: relative;
  overflow: hidden;
  margin-top: 50px;
}

.works_button::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0.2),
    transparent
  ) !important;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.works_button:hover::before {
  transform: translateY(0);
}

.works_button:hover {
  background: linear-gradient(to left, #36b2cd, #6164c4) !important;
}

/* x버튼 svg */
svg:hover {
  transition: background-color 0.5s ease;
  fill: #fff;
}

/*Modal css Start*/
.modal_main-box {
  width: 98%;
  height: 97%;
  background: linear-gradient(to right, #cdffd8 30%, #94b9ff);
  border-radius: 1%;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  position: absolute;
  z-index: 3;
}

.modal_backCaret {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
}
/* 장소 입력*/
.modal_Place_Name {
  position: absolute;
  top: 19px;
  width: 80%;
  height: 40px;
  font-size: 30px;
}

/* 현재 위치 입력*/
.nowAddress {
  position: absolute;
  top: 25px;
  right: 13%;
  width: 25px;
  height: 25px;
  z-index: 1;
}
/* 장소 검색*/
.searchPlace {
  position: absolute;
  top: 23px;
  right: 10%;
  width: 30px;
  height: 30px;
}
/*Modal List*/
.modal_info-box {
  margin-top: 20px;
  width: 80%;
  background-color: white;
  position: relative;
  top: calc(20px + 60px + 10px); /* modal_Place_Name 아래에 배치 */
}
.modal_list > div > div {
  margin-top: 10px;
  padding-top: 20px;
  display: inline-block; /*리스트 내용을 가로로 나열*/
  vertical-align: middle; /*리스트들을 중간으로 수직정렬*/
  font-size: 1.4rem; /*이 코드가 있어야 글자들이 안씹힘*/
  text-align: center; /*중간으로 값의 위치 지정*/
  padding: 5px 0;
}

/*리스트 아래 줄 생성*/
.modal_list > div {
  border-bottom: 2px solid #ddd;
  font-size: 0;
}

.modal_list .modal_location {
  width: 20%;
  text-align: left;
  padding-left: 2%;
  color: #000;
}

.modal_list .modal_address {
  width: 70%;
  text-align: right;
  padding-right: 2%;
  font-size: 1rem;
  color: #999;
}
</style>