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
                            <li v-for="(friend, index) in friendList" :key="index" :class="{ 'with-border': index !== friendList.length }">
                                <div class="element-left">{{ friend.name + index }}</div>
                                <div class="element-mid">{{ friend.address }}</div>
                                <button class="element-right delete" @click="removeFriend(index)"></button>
                            </li>
                        </ul>
                    </div>
                    <div class="warper-mid-btm">
                        <button class="add-button" @click="addFriend()">친구 추가하기</button>
                    </div>

                </div>
                <div class="warper-btm">
                    <form action="#">
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
    <!--모달 창-->
    <div class="modal-warper">
        <div class="modal-content">
            
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            friendList: [] // 친구 목록을 관리할 배열
        };
    },
    methods: {
        addFriend() {
            this.friendList.push({ name: '새로운 친구', address: '새로운 주소' });
        },
        removeFriend(index) {
            this.friendList.splice(index, 1);
        }
    }
}
</script>
<style></style>