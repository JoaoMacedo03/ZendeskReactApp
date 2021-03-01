#!/bin/bash

kill -9 $(lsof -t -i:4567)
kill -9 $(lsof -t -i:3000)
npm start &
cd zendesk-mock && zat server