const [Header, Sidebar, Footer] = await importComponent([
  '/views/commons/common_header.js',
  '/views/commons/common_sidebar.js',
  '/views/commons/common_footer.js',
]);

export default {
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      userName: 'Example',
    };
  },
  template: `
    <div class="d-flex flex-column vh-100">
      <!-- Header -->
      <Header />

      <div class="d-flex flex-grow-1 overflow-hidden">
        <!-- Sidebar -->
        <Sidebar class="bg-dark text-white" />

        <!-- Main Content -->
        <main class="flex-grow-1 bg-light p-4 overflow-auto">
          <router-view></router-view>
        </main>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  `
};
