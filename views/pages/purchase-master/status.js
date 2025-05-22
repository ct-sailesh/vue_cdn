export default {
  name: 'UpdateLeadStatus',
  props: ['statustype', 'id'],
  template: `<div><h2>Update Status '{{ statustype }}' for ID: {{ id }}</h2></div>`,
  setup(props) {
    return { ...props };
  }
};