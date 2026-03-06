<template>
  <!-- HEADER -->
  <v-app-bar
    class="app-header"
    elevation="0"
    color="white"
    border="b"
    height="72"
  >
    <v-container class="d-flex align-center justify-space-between h-100 py-0">
      <!-- Logo -->
      <router-link to="/" class="header-logo text-decoration-none">
        <v-avatar size="40" class="mr-2" color="primary" rounded="lg">
          <v-icon color="white" size="24">mdi-heart-pulse</v-icon>
        </v-avatar>
        <span class="logo-text">MediScan</span>
      </router-link>

      <!-- Nav Desktop -->
      <nav class="d-none d-lg-flex align-center" style="gap: 2rem;">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': $route.name === link.name }"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- CTA Button Desktop -->
      <v-btn
        class="d-none d-md-flex"
        color="primary"
        rounded="lg"
        size="large"
        @click="$router.push('/services')"
      >
        <v-icon start>mdi-robot</v-icon>
        Try AI
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      navLinks: [
        { to: '/', name: 'home', label: 'Home' },
        { to: '/services', name: 'services', label: 'Services' },
        { to: '/contact', name: 'contact', label: 'Contact' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.header-logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #159a8e;
  letter-spacing: -0.5px;
}

.nav-link {
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #159a8e;
  }

  &--active {
    color: #159a8e;
    font-weight: 600;
    border-bottom-color: #159a8e;
  }
}
</style>
