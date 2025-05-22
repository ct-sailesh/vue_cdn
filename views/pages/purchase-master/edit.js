export default {
  name: 'EditLead',
  props: ['id'],
  template: `<div><h2>Edit Lead - ID: {{ id }}</h2></div>`,
  setup(props) {
    return { id: props.id };
  }
};
