#!/bin/bash
export $(cat .env .env.local 2>/dev/null | grep -v '#' | xargs)
keystone build --no-ui && npm run migrate && next build
