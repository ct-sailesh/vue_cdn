export default {
  name: 'ViewLead',
  props: ['id'],
  template: `
    <div class="d-flex">
      <div class="p-4">
        <h2>Edit Lead - ID: {{ id }}</h2>
      </div>
    </div>
  `
};
