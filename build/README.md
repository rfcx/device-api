# Deployment

Overview:
- Device API is built and deployed by Jenkins (jenkins.rfcx.org) as defined in [Jenkinsfile](./Jenkinsfile)
- Deployment is triggered by push to master/staging. All configuration is in the sub-folders `testing`, `staging` and `production` (corresponding to a Kubernetes namespace).
- Secrets are stored on Kubernetes only in `device-api-secrets`, `staging-device-api-secrets` and `testing-device-api-secrets`.
- Deployment notifications are posted on Slack #alerts-deployment


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


## Kubernetes configuration

Each sub-folder matches the name of a namespace in Kubernetes. The app name is `device-api` in each namespace. For each namespace folder:

- deployment.yaml - set the resources and environment variables (non secret configuration)
- ingress.yaml - set the sub-domain
- service.yaml