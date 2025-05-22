let globalMixinInitialized = false;

export const globalMixin = {
  created() {
    if (!globalMixinInitialized) {
      globalMixinInitialized = true;
      console.log('✅ Mixin created() called ONCE on app start');
    }
  },
  computed: {
  },
  methods: {

    // basic
    $log(...args) {
      console.log(...args);
    },
    
    $baseURL() {
      return this.$baseURL;
    },
 

    // router
    $routeGet() {
      return this.$route.params.id;
    },
    $routeTo(route, type, delay = 0) {
      setTimeout(() => {
        if (type === 'refresh') {
          this.$router.push(route).then(() => {
            window.location.reload();
          });
        } else {
          this.$router.push(route);
        }
      }, delay * 1000);
    },
    $routeParams(setParams = {}) {
      const url = new URL(window.location.href);
      const queryParams = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      if (Object.keys(setParams).length > 0) {
        Object.entries(setParams).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, value);
          }
        });
        window.history.replaceState(null, '', url.toString());
      }
      return queryParams;
    },
    $routeMeta(key) {
      return this.$route?.meta?.[key];
    },

    // validations
    $isEmpty(str) {
      return !str || /^\s*$/.test(str);
    },
    $sanitizeHTML(input) {
      return String(input).replace(/<\/?[^>]+(>|$)/g, '').trim();
    },
    $numOnly(e) {
      if (!/\d/.test(e.key)) e.preventDefault();
    },
    $alphaNumOnly(e) {
      if (!/^[a-zA-Z0-9]$/.test(e.key)) e.preventDefault();
    },
    $isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    $capitalize(str) {
      return str.replace(/\b\w/g, ch => ch.toUpperCase());
    },
    $limitLength(e, maxLength) {
      if (e.target.value.length >= maxLength && !['Backspace', 'Delete'].includes(e.key)) {
        e.preventDefault();
      }
    },

    // Date/Time
    $formatTime(timestamp) {
      const date = new Date(timestamp);

      // Format to IST (Asia/Kolkata) using toLocaleString
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',   // Time zone for IST (Indian Standard Time)
        weekday: 'short',           // Abbreviated weekday (e.g., "Mon")
        year: 'numeric',            // Full year (e.g., "2025")
        month: 'short',             // Abbreviated month (e.g., "Apr")
        day: 'numeric',             // Day of the month (e.g., "27")
        hour: '2-digit',            // Hour (2 digits, e.g., "05")
        minute: '2-digit',          // Minute (2 digits, e.g., "45")
        second: '2-digit',          // Second (2 digits, e.g., "30")
        hour12: true                // Use 12-hour clock (AM/PM)
      });
    },


    // Alerts
    $toast(type = 'info', msg = '', time = 3000) {
      const container = document.getElementById('alert-container') || (() => {
        const c = document.createElement('div');
        c.id = 'alert-container';
        Object.assign(c.style, {
          position: 'fixed', top: '20px', right: '20px', zIndex: '9999'
        });
        document.body.appendChild(c);
        return c;
      })();
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} alert-dismissible fade show`;
      alert.role = 'alert';
      alert.innerHTML = `<span>${msg}</span><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
      container.appendChild(alert);
      setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
      }, time);
    },


    // Storage
    async $secureStorage(action, key, value = null, ttlSeconds = null) {
      const SECRET_KEY = "Zc/^itYu&[thsLe^qM:q6S-@af;Zr^q4";
      const enc = new TextEncoder();
      const dec = new TextDecoder();

      const getKey = async () => crypto.subtle.importKey(
        "raw",
        enc.encode(SECRET_KEY),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );

      const encrypt = async (data) => {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cryptoKey = await getKey();
        const encoded = enc.encode(JSON.stringify(data));
        const ciphertext = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          cryptoKey,
          encoded
        );
        return { iv: Array.from(iv), data: Array.from(new Uint8Array(ciphertext)) };
      };

      const decrypt = async (encrypted) => {
        const iv = new Uint8Array(encrypted.iv);
        const data = new Uint8Array(encrypted.data);
        const cryptoKey = await getKey();
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          cryptoKey,
          data
        );
        return JSON.parse(dec.decode(decryptedBuffer));
      };

      switch (action) {
        case 'set':
          if (ttlSeconds) {
            const payload = {
              value,
              expiry: Date.now() + ttlSeconds * 1000
            };
            const encryptedPayload = await encrypt(payload);
            localStorage.setItem(key, JSON.stringify(encryptedPayload));
          }
          break;

        case 'get':
          const encryptedStr = localStorage.getItem(key);
          if (!encryptedStr) return null;

          try {
            const encryptedPayload = JSON.parse(encryptedStr);
            const payload = await decrypt(encryptedPayload);

            this.$log('Retrieved val:', payload.value);
            this.$log('Retrieved exp:', this.$formatTime(payload.expiry));

            if (Date.now() > payload.expiry) {
              localStorage.removeItem(key);
              return null;
            }

            return payload.value;
          } catch (e) {
            console.error('Decryption or parsing failed', e);
            localStorage.removeItem(key);
            return null;
          }

        case 'remove':
          localStorage.removeItem(key);
          break;

        default:
          console.warn("Invalid action passed to $secureStorage");
      }
    },



    // Auth
    async $isAlreadyLoggedIn() {
      const [loggedIn, refresh_token, token] = await Promise.all([
        this.$secureStorage('get', 'loggedIn'),
        this.$secureStorage('get', 'refresh_token'),
        this.$secureStorage('get', 'token')
      ]);
      return !!refresh_token && !!token && loggedIn === '1';
    },

    async $getUserData() {
      const check = await this.$isAlreadyLoggedIn();
      if (!check) {
        return;
      }
      try {
        const res = await this.$http('POST', `${this.url}/apis/auth`, { action: 'get_user' }, {}, { auth: true });

        if (res?.status === 200 && res.body?.data?.routes) {
        }
      } catch (e) {
        console.error('User fetch failed:', e);
      }
    }

  }
};
