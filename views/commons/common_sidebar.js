export default {
  props: ['id'],
  computed: {
    currentPath() {
      return this.$route.path;
    },
    links() {
      return [
        { name: 'View', icon: 'bi-list-ul', to: `/purchase-master/lead/${this.id}` },
        { name: 'Edit', icon: 'bi-pencil-square', to: `/purchase-master/lead/${this.id}/edit` },
        { name: 'Status', icon: 'bi-info-circle', to: `/purchase-master/lead/${this.id}/status` },
      ];
    }
  },
  template: `
    <nav class="p-3 bg-dark text-white" style="width: 250px;">
      <ul class="nav flex-column">
        <li class="nav-item mt-3">
          <strong class="text-white">Lead: #{{ id }}</strong>
          <ul class="nav flex-column ms-3 mt-2">
            <li v-for="link in links" :key="link.to">
              <router-link
                :to="link.to"
                class="nav-link text-white"
                exact-active-class="active bg-primary text-white"
              >
                <i :class="['bi', link.icon, 'me-1']"></i> {{ link.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  `
};
