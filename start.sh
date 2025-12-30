#!/bin/bash
# Chạy cả frontend và backend
cd frontend && npm start &
cd backend && node server.js