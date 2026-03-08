<template>
  <v-footer class="app-footer py-12" border="t">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="mb-8 mb-md-0">
          <div class="footer-brand mb-6 d-flex align-center">
            <v-img
              src="/logo.png"
              alt="MediScan Branding"
              width="40"
              height="40"
              class="flex-grow-0 mr-3"
            />
            <span class="text-h5 font-weight-bold text-primary" style="letter-spacing: -1px; line-height: 1;">MediScan</span>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-6 pr-md-8">
            {{ $t('footer.description') }}
          </p>
          <div class="social-links d-flex ga-2">
            <v-btn v-for="icon in socialIcons" :key="icon" icon variant="tonal" size="small" color="primary">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col v-for="column in footerLinks" :key="column.title" cols="6" md="2" class="mb-8 mb-md-0">
          <h4 class="text-subtitle-1 font-weight-bold mb-6 opacity-80">{{ $t(column.title) }}</h4>
          <ul class="footer-list p-0">
            <li v-for="link in column.links" :key="link.text" class="mb-3">
              <router-link :to="link.to || '#'" class="text-body-2 text-medium-emphasis text-decoration-none hover-primary">{{ link.text }}</router-link>
            </li>
          </ul>
        </v-col>

      </v-row>

      <v-divider class="my-10"></v-divider>

      <div class="d-flex flex-column flex-md-row align-center justify-space-between ga-4">
        <p class="text-caption text-medium-emphasis">
          © {{ new Date().getFullYear() }} MediScan Technologies. {{ $t('footer.rights') }}
        </p>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const socialIcons = ['mdi-facebook', 'mdi-twitter', 'mdi-instagram', 'mdi-linkedin']
const footerLinks = [
  {
    title: 'footer.products',
    links: [
      { text: 'AI Simulator', to: '/services' },
      { text: '3D Anatomy', to: '/services?tab=models' },
      { text: 'Smart Reports', to: '/reports' },
    ],
  },
  {
    title: 'footer.support',
    links: [
      { text: 'Help Center', to: '/contact' },
      { text: 'FAQ', to: '/faq' },
      { text: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'footer.legal',
    links: [
      { text: 'Privacy Policy', to: '/privacy' },
      { text: 'Terms of Service', to: '/terms' },
      { text: 'Cookies', to: '#' },
    ],
  },
]
</script>

<style lang="scss" scoped>
.footer-list {
  list-style: none;
}
.hover-primary:hover {
  color: #159a8e !important;
}
</style>
