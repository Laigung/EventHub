# EventHub: Event Registration Platform

## To run the frontend, the quickets way is:

```bash
cd frontend/

docker build -f Dockerfile.pnpm -t eventhub_frontend .

# Run the container
docker run -p 3000:3000 eventhub_frontend
```


Finally, Browse http://localhost:3000 and start your journey!

More details please refer to the [frontend README](frontend/README.md)

