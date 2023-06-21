<template>
    <div></div>
</template>
<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import axios from 'axios';
import lodash from 'lodash-es';
import LogoCollapse from '@/assets/logo-collapse.svg?component';
import LogoWhite from '@/assets/logo-white.svg?component';
import Collapse from '@/assets/svg/collapse.svg?component';
import Expand from '@/assets/svg/expand.svg?component';
import Home from '@/assets/svg/home.svg?component';
import Ring from '@/assets/svg/ring.svg?component';
import User from '@/assets/svg/user-avatar.svg?component';
import { useAuthState } from '@/store/auth';
import Menu from './components/Menu.vue';
import NavBack from './components/NavBack.vue';
import UserInfo from './components/UserInfo.vue';
import testParent from '../test-parent';
import test from './test';
</script>
<style lang="scss" scoped>
.dashboard-container {
    height: calc(100vh - 64px);
}
</style>
