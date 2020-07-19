import { RouteConfig } from "vue-router";
import { Role } from "../core/types";

interface Metadata {
    authorize?: Role[];
}

export interface CustomRouteConfig extends RouteConfig {
    meta?: Metadata
}

const routes: RouteConfig[] = [
    { path: "/login", name: "login", component: () => import("pages/login/Login.vue") },
    {
        path: "/",
        component: () => import("layouts/Layout.vue"),
        children: [
            { path: "", name: "index", component: () => import("pages/index/Index.vue") },
            { path: "/user/registration", name: "user_registration", component: () => import("pages/users/registration/UserRegistration.vue") },
            { path: "/project/registration", name: "project_registration", component: () => import("pages/projects/registration/ProjectRegistration.vue") },
            { path: "/project/:id", name: "project", component: () => import("pages/projects/Project.vue") }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    { path: "*", component: () => import("pages/errors/Error404.vue") }
];

export default routes;
