const template = /*html*/ `
<div id="login_app" class="login_app">
  <div v-if="show_modal" class="modal-overlay"></div>
  <div v-if="show_modal" class="modal modal-sm fade show" style="display: block; z-index: 9999;">
    <div class="modal-dialog modal-dialog-centered" style="z-index: 10000;">
      <div class="modal-content">
        <div :class="second_step ? 'loginbg_step2' : 'loginbg'">
          <div class="login-title"><h1>Login</h1></div>
          <div class="login-panel" v-if="show_login">
            <div :class="second_step ? 'login_frm_step2' : 'login_frm'">
              <div v-if="err" class="alert alert-danger alert-sm form-group inpt" v-html="err"></div>

              <template v-if="first_step">
                <div class="form-group">
                  <input ref="mobile" class="form-control" placeholder="Mobile Number" maxlength="10" @keypress="$numOnly" v-model.trim="user.mobile" autocomplete="off" />
                </div>
                <div class="form-group d-flex align-items-center gap-2">
                  <img :src="captcha_img" style="min-width:100px;min-height:50px;" />
                  <img src="/assets/images/refresh.png" width="32" height="32" style="cursor: pointer;" @click="loadCaptcha" />
                </div>
                <div class="form-group">
                  <input ref="captcha" class="form-control" placeholder="Captcha"  maxlength="10" @keypress="$alphaNumOnly" @keyup.enter="sendOTP" v-model.trim="user.captcha" autocomplete="off" />
                </div>
              </template>

              <template v-if="second_step">
                <div class="form-group">
                  <input ref="otp" class="form-control" @keyup.enter="verifyOTP" maxlength="6" @keypress="$numOnly" placeholder="Enter OTP" v-model.trim="user.otp" autocomplete="off" />
                  <div class="otp-info">
                    <span v-if="show_timer" style="float:right;font-size:12px">{{ timer_msg }}</span>
                    <template v-else>
                      <a v-if="resend_cnt < resend_limit" @click="resendOTP" style="font-size:13px; color:#cf2230; float:right; cursor:pointer;">Resend OTP</a>
                      <span v-else style="float:right;font-size:12px">Max limit reached.</span>
                    </template>
                  </div>
                </div>
              </template>

              <div class="loginbtn">
                <button v-if="first_step" @click="sendOTP" class="btn mt-2 lgn_btn" :disabled="loading">
                  {{ loading ? 'Processing...' : 'LOGIN' }}
                </button>

                <div v-if="second_step" class="mt-4 d-flex justify-content-between">
                  <button @click="reset" class="btn btn-secondary btn-sm w-9">BACK</button>
                  <button @click="verifyOTP" class="btn btn-danger lgn_btn w-9" :disabled="loading">
                    {{ loading ? 'Verifying...' : 'Submit' }}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

export const AuthComponent = {
  name: 'AuthComponent',
  template,
  data() {
    return {
      url: this.$base_url_api,
      show_modal: false,
      show_login: false,
      first_step: true,
      second_step: false,
      loading: false,
      show_timer: false,
      timer_msg: '',
      resend_cnt: 0,
      resend_limit: 5,
      timer: null,
      err: null,
      captcha_img: '',
      captcha_loading: false,
      boundCheckToken: null,
      expiry: 86400,
      user: {
        mobile: '',
        captcha: '',
        captcha_token: '',
        otp: '',
        otp_token: ''
      }
    };
  },

  mounted() {
    this.boundCheckToken = this.checkToken.bind(this);
    window.addEventListener('storage', this.boundCheckToken);
    this.checkToken();
  },

  beforeDestroy() {
    window.removeEventListener('storage', this.boundCheckToken);
    this.clearTimer();
  },

  methods: {
    async checkToken() {
      if (!(await this.$isAlreadyLoggedIn())) {
        if (!this.show_modal) this.open();
      } else {
        await this.$getUserData();

        console.log(this.$router.getRoutes());
        this.close();
      }
    },

    open() {
      Object.assign(this.user, {
        mobile: '',
        captcha: '',
        captcha_token: '',
        otp: '',
        otp_token: ''
      });
      this.show_modal = this.show_login = true;
      this.first_step = true;
      this.second_step = false;
      this.err = null;
      this.loadCaptcha();
    },

    close() {
      this.show_modal = false;
      this.clearTimer();
    },

    reset() {
      this.first_step = true;
      this.second_step = false;
      this.err = null;
      this.user.otp = '';
      this.clearTimer();
    },

    resetErr() {
      this.err = null;
    },

    validate(fields) {
      for (const [key, msg] of Object.entries(fields)) {
        const value = this.user[key]?.trim();
        if (!value || (key === 'mobile' && !/^\d{10}$/.test(value)) || (key === 'otp' && !/^\d{6}$/.test(value))) {
          this.err = this.$sanitizeHTML(msg);
          this.$refs[key]?.focus();
          return false;
        }
      }
      return true;
    },

    async loadCaptcha() {
      if (this.captcha_loading) return;
      this.captcha_loading = true;
      try {
        const res = await this.request('get_captcha');
        if (res?.status === 200) {
          const { captcha_image, captcha_token } = res.body.data;
          this.captcha_img = captcha_image;
          this.user.captcha_token = captcha_token;
        } else {
          this.err = this.$sanitizeHTML(res?.body?.message || 'Failed to load captcha.');
        }
      } catch (e) {
        this.err = 'Unexpected error loading captcha.';
      } finally {
        this.captcha_loading = false;
      }
    },

    async sendOTP() {
      if (!this.validate({ mobile: 'Enter valid 10-digit mobile.', captcha: 'Enter captcha.' })) return;
      this.loading = true;
      this.resetErr();
      const res = await this.request('login', {
        mobile: this.user.mobile.trim(),
        captcha_code: this.user.captcha.trim(),
        captcha_token: this.user.captcha_token
      });
      this.loading = false;
      this.$log(res);
      if (res?.status === 200) {
        this.user.otp_token = res.body.data.otp_token;
        this.first_step = false;
        this.second_step = true;
        this.resend_cnt = 0;
        this.startTimer(res?.body?.data?.otp_timer || 30);
        this.$toast('success', res.body.message || 'OTP sent.');
      } else {
        this.err = this.$sanitizeHTML(Object.values(res?.body?.errors || {}).join('<br>'));
        this.$toast('danger', res.body.message || 'Failed to send OTP.');
      }
      this.loadCaptcha();
    },

    async resendOTP() {
      if (this.resend_cnt >= this.resend_limit) return;
      this.loading = true;
      this.resetErr();
      const res = await this.request('otp_resend', {
        mobile: this.user.mobile.trim(),
        otp_token: this.user.otp_token
      });
      this.loading = false;
      if (res?.status === 200) {
        this.user.otp_token = res.body.data.otp_token;
        this.$toast('success', res.body.message || 'OTP resent.');
        this.resend_cnt++;
        this.startTimer(res?.body?.data?.otp_timer || 30);
      } else {
        this.$toast('danger', res.body.message || 'Resend failed.');
      }
    },

    async verifyOTP() {
      if (!this.validate({ otp: 'Enter valid 6-digit OTP.' })) return;
      this.loading = true;
      this.resetErr();
      const res = await this.request('otp_verify', {
        mobile: this.user.mobile.trim(),
        otp: this.user.otp.trim(),
        otp_token: this.user.otp_token
      });
      this.loading = false;
      if (res?.status === 200) {
        const exp = res.body.data.expires_in || this.expiry;
        await Promise.all([
          this.$secureStorage('set', 'refresh_token', res.body.data.refresh_token, exp),
          this.$secureStorage('set', 'token', res.body.data.token, exp),
          this.$secureStorage('set', 'loggedIn', '1', exp)
        ]);
        this.$toast('success', res.body.message || 'Logged in.');
        this.close();
        this.$getUserData();
      } else {
        this.$toast('danger', res.body.message || 'OTP verification failed.');
      }
    },

    async request(action, data = {}) {
      try {
        const res = await this.$http('POST', `${this.url}/apis/auth`, { action, ...data }, {}, { auth: false });
        this.checkReDirect(res);
        return res;
      } catch (e) {
        this.checkReDirect(e);
        return { status: e.status, body: e.body };
      }
    },

    checkReDirect(res) {
      if (res.redirect) {
        this.$routeTo(res.redirect, 'refresh', 2);
      }
    },

    startTimer(duration = 60) {
      this.clearTimer();
      let time = duration;
      this.show_timer = true;
      this.timer_msg = `Resend OTP in ${time}s`;
      this.timer = setInterval(() => {
        time -= 1;
        this.timer_msg = `Resend OTP in ${time}s`;
        if (time <= 0) this.clearTimer();
      }, 1000);
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.show_timer = false;
    }
  }
};