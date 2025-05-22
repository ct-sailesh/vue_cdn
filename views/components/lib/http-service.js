export const httpService = {
    data() {
        return {
            cachedToken1: null,
            cachedToken2: null,
            tokenExpiration: null,
            jobQueue: [],
            isProcessing: false,
            DEFAULT_TIMEOUT: 10000,
            DEFAULT_RETRIES: 0,
            DEFAULT_AUTH: true,
        };
    },
    methods: {
        // Fetch a new access token
        async getAccessToken() {
            try {

                const logged = await isAlreadyLoggedIn();
                // const logged = await this.$secureStorage('get', 'loggedIn');
                // const refreshToken = await this.$secureStorage('get', 'refresh_token');
                // const accessToken = await this.$secureStorage('get', 'token');

                if (!logged) {
                    this.redirectToLogin();
                } else {

                    const response = await fetch(`${this.$base_url_api}/apis/auth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({ action: 'get_accesstoken', refresh_token: refreshToken }),
                    });
                    if (!response.ok) {
                        await this.redirectToLogin();
                    } else {
                        const data = await response.json();
                        const newAccessToken = data?.data?.token;

                        if (newAccessToken) {
                            await this.$secureStorage('set', 'refresh_token', data.data.refresh_token, 86400);
                            await this.$secureStorage('set', 'token', newAccessToken, data.data.expires_in || 86400);
                            return newAccessToken;
                        } else {
                            await this.redirectToLogin();
                        }
                    }
                }

            } catch (error) {
                console.error('Error in getAccessToken:', error);
                await this.redirectToLogin();
            }
        },

        // Remove login tokens
        async redirectToLogin() {
            try {
                await Promise.all([
                    // this.$secureStorage('remove', 'loggedIn'),
                    // this.$secureStorage('remove', 'refresh_token'),
                    // this.$secureStorage('remove', 'token')
                ]);
            } catch (error) {
                console.error('Error during redirectToLogin:', error);
            }
        },

        // Main HTTP function
        async $http(method = "GET", url = "", data = {}, headers = {}, options = {}) {
            const fetchWithTimeout = (url, fetchOptions, timeout) => {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);
                fetchOptions.signal = controller.signal;

                return fetch(url, fetchOptions).finally(() => clearTimeout(id));
            };

            const processJobs = async () => {
                if (this.isProcessing || this.jobQueue.length === 0) return;
                this.isProcessing = true;

                while (this.jobQueue.length > 0) {
                    const { method, url, data, headers, options, resolve, reject } = this.jobQueue.shift();
                    const retries = options.retries ?? this.DEFAULT_RETRIES;
                    const timeout = options.timeout ?? this.DEFAULT_TIMEOUT;
                    const auth = options.auth ?? this.DEFAULT_AUTH;

                    let attempt = 0;
                    let success = false;

                    while (attempt <= retries && !success) {
                        attempt++;
                        try {
                            let requestUrl = url;
                            const fetchOptions = {
                                method: method.toUpperCase(),
                                headers: { ...headers },
                            };

                            const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

                            // Handle auth
                            if (auth) {
                                let accessToken = await this.$secureStorage('get', 'token');
                                if (!accessToken) {
                                    accessToken = await this.getAccessToken();
                                }
                                if (accessToken) {
                                    fetchOptions.headers['Authorization'] = `Bearer ${accessToken}`;
                                }
                            }

                            if (fetchOptions.method === 'GET' && data && !isFormData && Object.keys(data).length > 0) {
                                const queryString = new URLSearchParams(data).toString();
                                requestUrl += (requestUrl.includes('?') ? '&' : '?') + queryString;
                            } else if (data) {
                                if (isFormData) {
                                    fetchOptions.body = data;
                                } else {
                                    fetchOptions.headers['Content-Type'] = 'application/json';
                                    fetchOptions.body = JSON.stringify(data);
                                }
                            }

                            const response = await fetchWithTimeout(requestUrl, fetchOptions, timeout);
                            const contentType = response.headers.get('content-type') || '';
                            const isJson = contentType.includes('application/json');
                            const parsedBody = isJson ? await response.json() : await response.text();

                            const result = {
                                status: response.status || 0,
                                body: parsedBody || {},
                            };

                            if (response.ok) {
                                resolve(result);
                                success = true;
                            } else if (response.status === 401 && auth) {
                                // Unauthorized - maybe token expired - try refreshing once
                                await this.getAccessToken();
                                // continue and retry
                            } else {
                                reject(result);
                                success = true; // Don't retry if server rejected
                            }
                        } catch (error) {
                            if (attempt > retries) {
                                console.error('HTTP Request failed:', error);
                                reject({ status: 0, body: {} });
                            }
                        }
                    }
                }

                this.isProcessing = false;
            };

            return new Promise((resolve, reject) => {
                if (!url) {
                    return reject(new Error("URL is required."));
                }
                this.jobQueue.push({ method, url, data, headers, options, resolve, reject });
                processJobs();
            });
        }
    }
};

export async function importComponent(paths = []) {
    try {
      const modules = await Promise.all(
        paths.map(path => import(`${path}?v=${ver}`))
      );
      return modules.map(m => m.default); 
    } catch (error) {
      console.error('Error importing component:', error);
      return [];
    }
}
  