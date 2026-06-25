const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const { rateLimit } = require('express-rate-limit');
const app = express();
const PORT = 3005;

app.use(morgan('combined'));

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 5
})

app.use(limiter);
app.use('/bookingservice', async (req, res, next) => {
    try {
        console.log(req.headers['x-access-token']);
        const response = await axios.get('http://localhost:3001/api/v1/isAuthenticated', {
        headers : {
            'x-access-token': req.headers['x-access-token']
        }
    })
    console.log(response.data);
    if (response.data.success) {
        next();
    }
    else {
        return res.status(401).json({
            message: "Authenticate krke aa"
        })
    }
    } catch (error) {
        return res.status(401).json({
            message : "Unauthorised"
        })
    }
})

app.use(
  '/bookingservice',
  createProxyMiddleware({
    target: 'http://localhost:3002/',
    changeOrigin: true,
  }),
);

app.listen(PORT, () => {
    console.log(`Server started listening on ${PORT}`);
})