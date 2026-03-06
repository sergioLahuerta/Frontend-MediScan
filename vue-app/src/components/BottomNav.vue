<template>
  <nav class="bottom-nav-mobile d-lg-none">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{
        'nav-item--active': $route.name === item.name,
        'nav-item--main': item.isMain,
      }"
    >
      <div v-if="item.isMain" class="nav-circle">
        <v-icon color="white" size="26">{{ item.icon }}</v-icon>
      </div>
      <template v-else>
        <v-icon :size="22">{{ item.icon }}</v-icon>
        <span>{{ item.label }}</span>
      </template>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomNav',
  data() {
    return {
      navItems: [
        { to: '/', name: 'home', label: 'Inicio', icon: 'mdi-home-outline' },
        { to: '/services', name: 'services', label: 'Servicios', icon: 'mdi-format-list-bulleted' },
        { to: '/services', name: 'services', label: '', icon: 'mdi-robot-happy-outline', isMain: true },
        { to: '/contact', name: 'contact', label: 'Contacto', icon: 'mdi-account-outline' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.bottom-nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.08);
  z-index: 900;
  overflow: visible;

  @media (min-width: 960px) {
    display: none !important;
  }
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #9ca3af;
  font-size: 10px;
  gap: 2px;
  transition: color 0.2s;
  height: 100%;
  position: relative;
  overflow: visible;

  &--active:not(.nav-item--main) {
    color: #159a8e;
  }

  &--main {
    overflow: visible;
    color: transparent;

    .nav-circle {
      position: absolute;
      top: -28px;
      background: #159a8e;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(21, 154, 142, 0.45);
      border: 4px solid #fff;
    }
  }
}
</style>
