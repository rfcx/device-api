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

- deployment.yaml - set the resources
- config.yaml - environment variables (non secret configuration)
- ingress.yaml - set the sub-domain
- service.yaml

## Database creation

First, create the new database and a username/password:

```sql
create database device;
create user device with encrypted password '<strongpassword>';
grant all privileges on database device to device;
```

Second, reconnect to the new database and create the meta schema (for storing migrations):

```sql
create schema sequelize;
```

// _TODO_
Migrations will run automatically on deployment.

## S3 bucket creation

Check your AWS CLI is authed, e.g. try to get a user profile

```shell
$ aws iam get-login-profile --user-name Ant
{
    "LoginProfile": {
        "UserName": "Ant",
        "CreateDate": "2017-05-29T09:49:06+00:00",
        "PasswordResetRequired": false
    }
}
```

Create a new user

```shell
$ aws iam create-user --user-name device-api-user
{
    "User": {
        "Path": "/",
        "UserName": "device-api-user",
        "UserId": "AID...",
        "Arn": "arn:aws:iam::887044485231:user/device-api-user",
        "CreateDate": "2021-02-17T09:50:30+00:00"
    }
}
```

Create the access key/secret

```shell
$ aws iam create-access-key --user-name device-api-user
{
    "AccessKey": {
        "UserName": "device-api-user",
        "AccessKeyId": "<secret>",
        "Status": "Active",
        "SecretAccessKey": "<secret>",
        "CreateDate": "2021-02-17T09:54:13+00:00"
    }
}
```

Create the bucket

```shell
$ aws s3 mb s3://rfcx-device-assets
```

Create a bucket policy to allow access to the user

```shell
aws s3api put-bucket-policy --bucket rfcx-device-assets --policy file://build/policy.json
```

where policy.json is a final in the current directoring containing

```json
{
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:ListBucket"],
            "Resource": ["arn:aws:s3:::rfcx-device-assets"]
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject", "s3:PutObject"],
            "Resource": "arn:aws:s3:::rfcx-device-assets/*"
        }
    ]
}
```
