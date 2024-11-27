
# Caching Proxy Server

A simple cache proxy server to cache simple **GET** requests made using **Express.js** , **Axios** and **Redis**.

### Steps to run Server
``node cache-proxy <port> <expiration-time> <origin>``

### Example :
``node cache-proxy 4000 60 http://dummyjson.com``
