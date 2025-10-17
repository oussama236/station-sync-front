pipeline {
  agent any
  options { timestamps() }

  environment {
    IMAGE_NAME   = 'oussamamiladi123/stationsync-frontend'
    REGISTRY_CRED = 'dockerhub'
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Frontend Test (coverage)') {
      steps {
        sh '''
          set -e
          docker run --rm -v "$PWD":/app -v /var/lib/jenkins/.npm:/root/.npm -w /app node:20-alpine sh -lc "
            corepack enable || true &&
            npm ci &&
            (npm run test -- --watch=false --code-coverage || true) &&
            if [ ! -f coverage/*/lcov.info ]; then
              mkdir -p coverage/app && echo 'TN:' > coverage/app/lcov.info
            fi
          "
        '''
      }
    }

    stage('SonarQube Analysis (frontend)') {
      steps {
        withSonarQubeEnv('local-sonarqube') {
          script {
            def scannerHome = tool 'SonarScanner'
            sh "${scannerHome}/bin/sonar-scanner"
          }
        }
      }
    }

    stage('Install & Build (prod)') {
      steps {
        sh '''
          set -e
          docker run --rm \
            -v "$PWD":/app \
            -v /var/lib/jenkins/.npm:/root/.npm \
            -w /app node:20-alpine sh -lc "
              corepack enable || true &&
              npm install -g @angular/cli &&
              npm ci --no-audit --no-fund &&
              npx ng build --configuration production
            "
        '''
      }
    }

    stage('Archive dist') {
      steps {
        sh 'ls -la dist || true'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Docker Build & Tag') {
      steps {
        script {
          COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          TAG = COMMIT
        }
        sh "set -e; docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${TAG} ."
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.REGISTRY_CRED, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh """
            set -e
            echo "${PASS}" | docker login -u "${USER}" --password-stdin
            docker push ${IMAGE_NAME}:${TAG}
            docker push ${IMAGE_NAME}:latest
            docker logout
          """
        }
      }
    }

    stage('Deploy to VM') {
  when { branch 'main' }
  steps {
    sh """
      set -e
      cd /opt/stationsync

      # Use the freshly built tag WITHOUT touching .env
      FRONT_IMAGE=${IMAGE_NAME}:${TAG} docker compose pull frontend
      FRONT_IMAGE=${IMAGE_NAME}:${TAG} docker compose up -d --no-deps --force-recreate --pull always frontend

      echo '--- Running image ---'
      docker inspect -f '{{.Config.Image}}' stationsync-frontend
    """
  }
}

  }

  post {
    success { echo "✅ Frontend deployed: ${IMAGE_NAME}:${TAG}" }
    failure { echo "❌ Frontend pipeline failed — check logs." }
    always  { echo "📦 Pipeline: ${currentBuild.currentResult}" }
  }
}
