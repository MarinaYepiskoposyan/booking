# Deployment Guide — Google Cloud Run

This guide walks through the one-time infrastructure setup and explains how
subsequent deploys happen automatically via GitHub Actions.

---

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialised (`gcloud init`)
- A GCP project with billing enabled
- The `gcloud` CLI authenticated as a project Owner or Editor
- The GitHub repository pushed to GitHub

Set two shell variables you will reuse throughout this guide:

```bash
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1
```

---

## 1. Enable required GCP APIs

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  --project="$PROJECT_ID"
```

---

## 2. Create the Cloud SQL instance (MySQL 8)

```bash
gcloud sql instances create booking-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --project="$PROJECT_ID"
```

Create the database and a dedicated user:

```bash
gcloud sql databases create booking_db \
  --instance=booking-mysql \
  --project="$PROJECT_ID"

gcloud sql users create booking_user \
  --instance=booking-mysql \
  --password=CHANGE_ME \
  --project="$PROJECT_ID"
```

Note the **connection name** — you will need it for the Cloud Run env var:

```
PROJECT_ID:us-central1:booking-mysql
```

---

## 3. Create the Artifact Registry repository

```bash
gcloud artifacts repositories create booking \
  --repository-format=docker \
  --location="$REGION" \
  --project="$PROJECT_ID"
```

---

## 4. Set up Workload Identity Federation for GitHub Actions

### 4a. Create a service account

```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions — booking" \
  --project="$PROJECT_ID"

SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 4b. Grant the service account the required roles

```bash
for ROLE in \
  roles/run.admin \
  roles/artifactregistry.writer \
  roles/cloudsql.client \
  roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$ROLE"
done
```

### 4c. Create the Workload Identity Pool and Provider

```bash
gcloud iam workload-identity-pools create github-pool \
  --location=global \
  --project="$PROJECT_ID"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --workload-identity-pool=github-pool \
  --location=global \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --project="$PROJECT_ID"
```

### 4d. Allow the GitHub repository to impersonate the service account

Replace `GITHUB_ORG/GITHUB_REPO` with your actual GitHub owner/repo:

```bash
GITHUB_REPO="GITHUB_ORG/GITHUB_REPO"

POOL_ID=$(gcloud iam workload-identity-pools describe github-pool \
  --location=global \
  --project="$PROJECT_ID" \
  --format="value(name)")

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/${GITHUB_REPO}" \
  --project="$PROJECT_ID"
```

### 4e. Retrieve the provider resource name

```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --workload-identity-pool=github-pool \
  --location=global \
  --project="$PROJECT_ID" \
  --format="value(name)"
```

Copy the output — this is your `GCP_WORKLOAD_IDENTITY_PROVIDER` secret value.

---

## 5. Configure GitHub Secrets

In your GitHub repository go to **Settings → Secrets and variables → Actions**
and add the following repository secrets:

| Secret name                      | Value                                                         |
|----------------------------------|---------------------------------------------------------------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full provider resource name from step 4e                      |
| `GCP_SERVICE_ACCOUNT`            | `github-actions@PROJECT_ID.iam.gserviceaccount.com`           |
| `PROJECT_ID`                     | Your GCP project ID                                           |
| `REGION`                         | `us-central1` (or your chosen region)                         |
| `JWT_SECRET`                     | A long random string used to sign JWTs (min 32 chars)         |
| `DB_USERNAME`                    | `booking_user` (the user created in step 2)                   |
| `DB_PASSWORD`                    | The password you set in step 2                                |

---

## 6. First deploy

Push to the `master` branch (or open and merge a PR into `master`). GitHub
Actions will:

1. Run **ci.yml** — compile, test, and build both apps.
2. Run **cd.yml** — build Docker images, push to Artifact Registry, and deploy
   both services to Cloud Run.

You can watch progress in the **Actions** tab of the repository.

---

## 7. Get the Cloud Run service URLs

After the CD workflow succeeds:

```bash
gcloud run services describe booking-backend \
  --region=us-central1 \
  --project="$PROJECT_ID" \
  --format="value(status.url)"

gcloud run services describe booking-frontend \
  --region=us-central1 \
  --project="$PROJECT_ID" \
  --format="value(status.url)"
```

The frontend URL is the public address for the app. The backend URL is used
internally by the frontend nginx proxy (automatically injected as `BACKEND_URL`
by the CD workflow).

---

## Local development with Docker Compose

```bash
# Optional: set a custom JWT secret (a default is provided for local dev)
export JWT_SECRET=my-local-secret

docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:4200  |
| Backend  | http://localhost:8080  |
| MySQL    | localhost:3306         |
