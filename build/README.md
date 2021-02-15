# Deployment


## Test deployment locally

Requires Docker.

1.  Build the image
    ```
    docker build -t device-api -f build/Dockerfile .
    ```

2.  Run the app 
    ```
    docker run -it --rm device-api -p 3000:3000
    ```

