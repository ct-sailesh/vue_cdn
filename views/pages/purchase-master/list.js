export default {
  name: 'LeadList',
  data() {
    return {
      leads: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'Converted' }
      ]
    };
  },
  methods: {
    editLead(id) {
      this.$router.push(`/purchase-master/lead/${id}`);
    },
    viewStatus(lead) {
      this.$router.push(`/purchase-master/lead/${lead.id}/status`);
    }
  },
  template: `
    <div class="mt-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Lead List</h2>
        <router-link to="/purchase-master/add" class="btn btn-primary">
          <i class="bi bi-plus-circle me-1"></i> Add Lead
        </router-link>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead.id">
              <td>{{ lead.id }}</td>
              <td>{{ lead.name }}</td>
              <td>{{ lead.email }}</td>
              <td>
                <span class="badge bg-secondary">{{ lead.status }}</span>
              </td>
              <td class="text-center">
                <button @click="editLead(lead.id)" class="btn btn-sm btn-warning me-1">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button @click="viewStatus(lead)" class="btn btn-sm btn-info text-white">
                  <i class="bi bi-info-circle"></i> Status
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
};
