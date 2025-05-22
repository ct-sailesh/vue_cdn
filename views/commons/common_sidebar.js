export default {
  data() {
    return {
      currentPath: this.$route.path
    };
  },
  watch: {
    $route(to) {
      this.currentPath = to.path;
    }
  },
  template: `
    <nav class="p-3 bg-dark text-white" style="width: 250px;">
      <h5 class="text-white mb-4">Dealer Panel</h5>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/dashboard">
            <i class="bi bi-house me-2"></i> Dashboard
          </router-link>
        </li>

        <!-- Purchase Master Tab Section -->
        <li class="nav-item mt-3">
          <strong class="text-white">Purchase Master</strong>
          <ul class="nav flex-column ms-3 mt-2">
            <li>
              <router-link 
                class="nav-link text-white" 
                :class="{ 'active bg-primary text-white': currentPath === '/purchase-master' }"
                to="/purchase-master"
              >
                <i class="bi bi-list-ul me-1"></i> Lead List
              </router-link>
            </li>
            <li>
              <router-link 
                class="nav-link text-white" 
                :class="{ 'active bg-primary text-white': currentPath === '/purchase-master/add' }"
                to="/purchase-master/add"
              >
                <i class="bi bi-plus-circle me-1"></i> Add Lead
              </router-link>
            </li>
            <!-- Optional: add conditional logic if needed for edit/status -->
          </ul>
        </li>
      </ul>
    </nav>
  `
};
