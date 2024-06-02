import { createRouter, createWebHistory } from "vue-router";
import InputPage from "@/components/InputPage.vue";
import MiddleMap from "@/components/MiddleMap.vue";
import ListPage from "@/components/ListPage.vue";

const routes = [
    { path: "/", name: "InputPage", component: InputPage,},
    { path: "/MiddleMap.page", name: "MiddleMap", component: MiddleMap,},
    { path: "/ListPage.page", name: "ListPage", component: ListPage,},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;