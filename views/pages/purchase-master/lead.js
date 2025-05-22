const [Sidebar] = await importComponent([
  '/views/commons/common_sidebar.js',
]);

export default {
  name: 'EditLead',
  props: ['id'],
  components: {
    Sidebar
  },
  template: `
    <div class="d-flex">
      <Sidebar :id="id" />
      <div class="p-4">
        <router-view></router-view>
      </div>
    </div>
  `
};
