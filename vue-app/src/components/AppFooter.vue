<template>
  <v-footer class="app-footer" color="grey-darken-4">
    <v-container>
      <v-row class="py-6">
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <div class="d-flex align-center mb-3">
            <v-avatar size="36" color="primary" rounded="lg" class="mr-2">
              <v-icon color="white" size="20">mdi-heart-pulse</v-icon>
            </v-avatar>
            <span class="footer-logo">MediScan</span>
          </div>
          <p class="footer-description">
            Revolutionizing medical diagnosis with AI and 3D visualization technology.
          </p>
        </v-col>

        <v-col cols="6" md="4">
          <h4 class="footer-title mb-3">Navigation</h4>
          <ul class="footer-list">
            <li v-for="link in navLinks" :key="link.to">
              <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
            </li>
          </ul>
        </v-col>

        <v-col cols="6" md="4">
          <h4 class="footer-title mb-3">Contact</h4>
          <ul class="footer-list">
            <li><a href="mailto:info@mediscan.com" class="footer-link">info@mediscan.com</a></li>
            <li><a href="tel:+34911234567" class="footer-link">+34 91 123 45 67</a></li>
            <li><span class="footer-text">Zaragoza, Spain</span></li>
          </ul>
        </v-col>
      </v-row>

      <v-divider color="grey-darken-3" />

      <div class="text-center py-4 footer-copy">
        &copy; 2026 MediScan. All rights reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      navLinks: [
        { to: '/', label: 'Home' },
        { to: '/services', label: 'Services' },
        { to: '/contact', label: 'Contact' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.footer-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.footer-title {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-list {
  list-style: none;
  padding: 0;

  li { margin-bottom: 0.5rem; }
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover { color: #159a8e; }
}

.footer-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.footer-copy {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}
</style>
