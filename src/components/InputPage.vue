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
                    <form action="/KakaoMap.page">
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
    <div class="modal-warper" v-if="modalOpen" @click.self="closeModal()">
        <div class="modal-content">
            <div class="modal-content-top">
                <img src="@/assets/caret-modal-fill.svg" alt="뒤로가기" @click="closeModal()" />
                <input class="input-name" placeholder="이름을 입력하세요!" type="text" id="name" v-model="name" maxlength="17"/>
                <img src="@/assets/mylocation.svg" alt="현재 위치" @click="현재위치()"/>
            </div>
            <div class="modal-content-mid">
                <input class="input-location" placeholder="어디에서 출발하나요?" type="text" id="location" v-model="location" maxlength="36"/>
                <img class="search-img" src="../assets/돋보기.png" @click="addFriend()"/>
            </div>
            <div class="modal-content-btm"></div>
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
        },

        /* 튜플 추가 함수 */
        addFriend(){
            if(this.location.trim() ===''){
                alert("주소를 입력하세요!");
                return; //주소가 공백이면 알람창을 띄우고 돌아감
            }
            this.friendList.push({ name: this.name, address: this.location}); //입력한 값을 배열에 추가
            this.closeModal();
        },

        /* 튜플 삭제 함수 */
        removeFriend(index) {
            this.friendList.splice(index, 1);
        },

        현재위치(){
            alert("현재위치 기능");
        }
    }
}
</script>