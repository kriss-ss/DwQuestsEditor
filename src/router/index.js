import {createRouter, createWebHistory} from 'vue-router';
import index from '@/views/index.vue';
import editor from '@/views/editor.vue';

const routes = [
    {
        path: '/',
        name: 'index',
        component: index
    },
    {
        path: '/editor',
        name: 'editor',
        component: editor
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;