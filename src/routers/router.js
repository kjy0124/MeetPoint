import { createRouter, createWebHistory } from "vue-router";
import InputPage from "@/components/InputPage.vue";
import MiddleMap from "@/components/MiddleMap.vue";
import MainPage from "@/components/MainPage.vue";
import KakaoMap from "@/components/KakaoMap.vue";
import ListPage from "@/components/ListPage.vue";

const routes = [
    { path: "/InputPage", name: "InputPage", component: InputPage,},
    { path: "/MiddleMap.page", name: "MiddleMap", component: MiddleMap,},
    { path: "/", name: "MainPage", component: MainPage,},
    { path: "/KakaoMap.page", name: "KakaoMap", component: KakaoMap,},
    { path: "/ListPage.page", name: "ListPage", component: ListPage,},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;