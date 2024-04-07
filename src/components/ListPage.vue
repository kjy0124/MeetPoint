<template>
    <div class="container">
        <div class="ttteeesssttt">
            <h1>리스트 페이지</h1>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <input type="button" value="첫페이지 ㄱㄱ" @click="moveMainPage()" />
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <input type="button" value="두번째페이지 ㄱㄱ" @click="moveKakaoMap()" />
        </div>
    </div>

</template>

<script>

export default {
    name: "ListPage",
    data() {
        return {

        }
    },
    methods: {
        moveMainPage() {
            this.$router.push({ name: "InputPage", params: {} });
        },

        moveKakaoMap() {
            this.$router.push({ name: "MiddleMap", params: {} });
        },

    },
    created() {

    },
    mounted() {

    },

}
</script>

<style>
.container {
    display: flex;
    text-align: center;
    align-items: center;

}

.ttteeesssttt{
    margin: auto;
    align-items: center;
    text-align: center;
}
</style>