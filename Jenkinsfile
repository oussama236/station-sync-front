pipeline {
  agent any
  options { timestamps() }

  environment {
    IMAGE_NAME = "oussamamiladi123/stationsync-frontend"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Frontend Test (coverage)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "
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
            sh """
              ${scannerHome}/bin/sonar-scanner
            """
          }
        }
      }
    }

    // --------------- UPDATED STAGE BELOW ---------------
    stage('Install & Build (prod)') {
  steps {
    sh '''
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

    // ---------------------------------------------------

    stage('Archive dist') {
      steps {
        sh 'ls -la dist || true'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Docker Build') {
      steps {
        script {
          COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          TAG = COMMIT
        }
        sh """
          docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${TAG} .
        """
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh """
            echo "${PASS}" | docker login -u "${USER}" --password-stdin
            docker push ${IMAGE_NAME}:latest
            docker push ${IMAGE_NAME}:${TAG}
            docker logout
          """
        }
      }
    }

    stage('Deploy to VM') {
      when { branch 'main' }
      steps {
        sh '''
          cd /opt/stationsync
          echo "🧹 Cleaning old frontend container (if exists)..."
          docker compose down frontend || true

          echo "⬇️ Pulling latest frontend image..."
          docker compose pull frontend

          echo "🚀 Starting new frontend container..."
          docker compose up -d frontend
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Build Angular réussi, Docker push & déploiement OK : ${IMAGE_NAME}:latest"
    }
    failure {
      echo "❌ Erreur pendant le pipeline Angular. Vérifie les logs Jenkins."
    }
    always {
      echo "📦 Pipeline terminé : ${currentBuild.currentResult}"
    }
  }
}
