export default {
  name: 'add',
  data(){
    return{

    }
  },
  emits:['title','msg'],
  directives: {
  },
  mounted(){

  },
  methods: {
  
  }, 


template: `
<span v-if="loading">
  <div class="wrapper">
    <div class="wrapper-cell">
      <div class="text ms-0">
        <div class="text-line animated-background"></div>
        <div class="text-line animated-background"></div>
        <div class="text-line animated-background"></div>
        <div class="text-line animated-background"></div>
      </div>
    </div>
  </div>
  <div class="wrapper-cell">
    <div class="image animated-background "></div>
    <div class="text">
      <div class="text-line animated-background"></div>
      <div class="text-line animated-background"></div>
      <div class="text-line animated-background"></div>
      <div class="text-line animated-background"></div>
    </div>
  </div>
</span>
<div v-if="Object.keys(validations).length">
<div class="alert alert-warning" role="alert" v-if="this.$route.name=='Add_PM'">
  <i class="feather-alert-octagon"></i> Do not use this form for trade-in leads.
</div> 
<form class="mt-3 g-3 needs-validation" novalidate v-cloak>
  <div class="row">
    <div class="col-md-6 mb-4 form-floating">
      <input type="text" class="form-control" id="fname" name="fname" v-maxLength="50" v-model.trim="add_pm_form['fname']" placeholder="First name" @blur="handle_blur">
      <label for="fname">First name <span class="text-danger">*</span>
      </label>
      <div id="fnameHelp" class="invalid-feedback"></div>
    </div>
    <div class="col-md-6 mb-4 form-floating">
      <input type="text" class="form-control" id="lname" name="lname" v-maxLength="50" v-model.trim="add_pm_form['lname']" placeholder="Last name" @blur="handle_blur">
      <label for="lname">Last name</label>
      <div id="lnameHelp" class="invalid-feedback"></div>
    </div>
    <div class="col-md-6 mb-4 form-floating">
      <input type="text" class="form-control" id="mobile" name="mobile" v-maxLength="10" v-model.trim="add_pm_form['mobile']" placeholder="Mobile (mandatory for customer cars)" @input="isNumber($event)" @blur="handle_blur">
      <label for="mobile">Mobile (mandatory for customer cars) <span class="text-danger">*</span>
      </label>
      <div id="mobileHelp" class="invalid-feedback"></div>
    </div>
  </div>
  <div class="col-12 col-md-5 py-3 mb-3 d-flex justify-content-center position-sm-fixed bottom-0 bg-white row-md me-auto">
    <!--<div class="col-md-2 cols w-10">
      <router-link class="btn btn-secondary btn-md" to="/"><i class="feather-chevron-left"></i></router-link>
    </div>-->
      <button class="btn btn-primary btn-md w-100" :disabled='isDisabled' type="submit" @click.prevent="add_pm_lead">
      <span v-if="isDisabled" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Add Lead</button>
  </div>
</form>

</div>
`
};