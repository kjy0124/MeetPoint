import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import KakaoMap from "@/components/KakaoMap.vue";

const routes = [
    {
        path: "/",
        name: "MainPage",
        component: MainPage,
    },
    {
        path: "/KakaoMap.page",
        name: "KakaoMap",
        component: KakaoMap,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;