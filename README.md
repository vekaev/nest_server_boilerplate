## Development

```bash
# For DB
docker-compose -f docker-compose.dev.yml up

# For API
npm start
```

### For debugging

```bash
find [YOUR_PATH]/main_nest_server/src/ -type f -name '*.js' -exec rm {} +
```