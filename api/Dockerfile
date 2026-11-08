# Build from the repository root:  docker build -f api/Dockerfile -t love-iteration-api .
# The API has no runtime dependencies and Node 22 runs TypeScript directly
# (type stripping), so there is nothing to install or compile.
FROM node:22-slim
ENV NODE_ENV=production \
    LOVE_DB_PATH=/data/love.db \
    LOVE_HOST=0.0.0.0
WORKDIR /app
COPY api/package.json ./
COPY api/src ./src
# Tests are not needed in the image.
RUN find src -name '*.test.ts' -delete
# A folder for the database; a mounted volume copies its owner.
RUN mkdir /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 8787
CMD ["node", "src/main.ts"]
