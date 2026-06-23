'use strict';

import { Router } from 'express';
import { addClient, removeClient } from './sse.js';

const router = Router();

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setTimeout(0);
    res.flushHeaders();

    res.write(': connected\n\n');

    addClient(res);

    const heartbeat = setInterval(() => {
        res.write(': ping\n\n');
    }, 25000);

    req.on('close', () => {
        clearInterval(heartbeat);
        removeClient(res);
    });
});

export default router;
