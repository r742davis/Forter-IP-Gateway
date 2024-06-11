# Forter - Gateway API Challenge
This is a simple API gateway server that provides a country name associated with an IP address as a JSON response. The user can hit one API endpoint to retrieve their IP location for free.

 ### Acceptance Criteria:
 1. API Request includes IP address from query parameter
 2. API Response includes associated country name to IP address
 3. Use at least 2 IP vendors
 4. Use naive cache for previously requested IP addresses
 5. Use rate limiter
 6. Must have Global configurable rate limits per vendor per hour
 7. Accessing cache does NOT count towards the rate limit
 8. If result is not in cache _**and**_ rate limit is exceeded for all vendors, return error message
 9. Include E2E testing
 10. Include README (how to run server, steps to test E2E for API, explanation for design choices)

 #### Bonus Criteria:
 - Appropriate error handling
 - Testing

## How to Launch the App Locally

### Prerequisites
- Node.js installed
- Git installed

### Steps

1. **Clone the repository using your terminal of choice**:
    ```bash
    git clone https://github.com/r742davis/Forter-IP-Gateway.git
    cd forter-ip-gateway
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
   - Create a `.env` file in the top level directory with the following variables:
     ```plaintext
     PORT=3000
     IPSTACK_API_KEY=<<REPLACE>>
     IPDATA_API_KEY=<<REPLACE>>
     LOCAL_IPV4=127.0.0.1
     LOCAL_IPV6=::1
     ```

4. **Run the Node app using this command**:
    ```bash
    npm run start
    ```

5. **Access the app**:
   - Choose an IP address to add to the query parameter `ip`, open your browser, and navigate  `http://localhost:3000/country?ip={IP_ADDRESS_GOES_HERE}`
   - You can also navigate to `http://localhost:3000/country` to get your local machine's IP address
  
6. **Expected Result using test IP** (`http://localhost:3000/country?ip=117.36.32.155`) :
   ```
   {"country":"China"}
   ```
    - Hit the API again?
    ```
    {"country":"China","cached":true}
    ```

## Implementation Notes

### IP Vendors:
- [ipstack](https://ipstack.com/)
- [ipdata](https://ipdata.co/)

### Design Decisions

This is a Node.js server built with Express which provides a framework with good APIs and middleware functionality. From there, I decided to work with some basic packages like `axios` for fetching in the Node environment and `node-cache` for naive caching due to their simplicity and ease of use. Since we are not building an advanced caching solution, `node-cache` was an easy choice and I would most likely replace it with Redis if we required any more advanced caching features.

2 IP vendor services were chosen and another service from `api.ipify.org` was chosen to simulate the IP address retrieval of the local machine if the query parameter is not provided.

Global configurable rate limit options are found in the `global.ts` file. The `VENDOR_OPTIONS` variable contains rate limiting options based around the "Token Bucket" method which is able to handle higher bursts of traffic without limiting traffic during slower periods. Each `refillRate` is the `maxToken / SECONDS_IN_AN_HOUR` to simulate rate limits of the server per vender per hour. In this method, the cache will be accessed first and if the country name is found then that will **not** count towards the rate limit.

On the development side, I chose to use TypeScript in order to provide type safety and intellisense in my IDE. I added `npm` scripts to handle TypeScript compilation and `rimraf` to clean out the target folder of the old compiled code before running the server.

#### List of Tech Used:
- **`axios`**
- **`express`**
- **`node-cache`**
- **`dotenv`**
- **`rimraf`**
- **TypeScript**
- **Token Bucket Rate Limiter**

### Ideas for Improvement:
- Security Enhancements:
  - Input Validation
  - Rate Limiting per User
  - Route Authentication
- Loading Balancing Service
- Redis Caching for Scalability
- Async Rate Limiting
- API Health Checks

There's a lot that can be done to improve upon this basic implementation. Route authentication would be at the top of the list so I can limit the verified traffic to my API and not drive up server costs. Then I would focus on other security concerns including input validation and rate limiting specific users. 

Once a small security layer is created, I can look into load balancing service such as Nginx or a custom solution using `http-proxy` for simpler use-cases. Instead of the naive caching solution I have built with `node-cache`, I can instead utilize Redis to provide more robust in-memory caching that can help the app scale seamlessly. Alongside these improvements, I could also implement edge functionality services, provide API monitoring, and use asynchronous processing of requests to better handle high volumes of traffic.

Although this is a simple app, these considerations show that there are a lot of ways that we can improve upon the architecture without compromising developer speed or resources.

## Testing

### List of Random IPs
1. Launch the local dev environment (see: **How to Launch the App Locally** section)
2. Replace `{IP_ADDRESS_GOES_HERE}` with each one of the IP addresses listed below: `http://localhost:3000/country?ip={IP_ADDRESS_GOES_HERE}`

| IP Address  | Country |
| ------------- |:-------------:|
| 117.36.32.155    | China    |
| 170.242.166.75    | United States     |
| 112.110.202.18    | India     |
| 78.155.9.99 | Switzerland |
| 78.236.220.47 | France |