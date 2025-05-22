export default {
  name: 'AddLead',
  data() {
    return {
      formFields: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          validate: value => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email address'
        },
        {
          key: 'mobile',
          label: 'Mobile Number',
          type: 'text',
          required: true,
          validate: value => /^[0-9]{10}$/.test(value) || 'Enter a valid 10-digit number'
        },
        {
          key: 'source',
          label: 'Lead Source',
          type: 'select',
          required: true,
          options: ['Website', 'Referral', 'Advertisement']
        }
      ],
      formData: {},
      errors: {}
    };
  },
  created() {
    // Initialize formData with empty values
    this.formFields.forEach(field => {
      this.formData[field.key] = '';
    });
  },
  methods: {
    validateForm() {
      this.errors = {};

      this.formFields.forEach(field => {
        const value = this.formData[field.key];
        if (field.required && !value) {
          this.errors[field.key] = `${field.label} is required.`;
        } else if (field.validate) {
          const result = field.validate(value);
          if (result !== true) {
            this.errors[field.key] = result;
          }
        }
      });

      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      if (!this.validateForm()) return;

      try {
        const action = 'add-lead'; // or whatever your backend expects
        const res = await this.$http(
          'POST',
          `${this.url}/apis/pm/add`,
          { action, ...this.formData },
          {},
        );

        if (res?.success) {
          alert('Lead added successfully!');
          this.$router.push('/purchase-master');
        } else {
          alert(res?.message || 'Failed to add lead.');
        }
      } catch (err) {
        console.error('Error submitting lead:', err);
        alert('An error occurred while submitting the form.');
      }
    }
  },
  template: `
    <div class="container bg-white p-4 rounded shadow-sm">
      <h4 class="mb-4">Add New Lead</h4>
      <form @submit.prevent="submitForm" novalidate>
        <div v-for="field in formFields" :key="field.key" class="mb-3">
          <label class="form-label">{{ field.label }}</label>
          
          <!-- Input or Select -->
          <template v-if="field.type === 'select'">
            <select v-model="formData[field.key]" 
                    class="form-select" 
                    :class="{ 'is-invalid': errors[field.key] }">
              <option disabled value="">-- Select --</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>
          
          <template v-else>
            <input :type="field.type"
                   class="form-control"
                   v-model="formData[field.key]"
                   :class="{ 'is-invalid': errors[field.key] }" />
          </template>

          <div class="invalid-feedback">{{ errors[field.key] }}</div>
        </div>

        <button type="submit" class="btn btn-primary">Add Lead</button>
      </form>
    </div>
  `
};
