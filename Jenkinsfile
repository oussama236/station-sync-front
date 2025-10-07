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


    stage('Install & Build (prod)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "
            npm ci &&
            npm run build -- --configuration production
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

 stage('SonarQube Analysis (frontend)') {
  steps {
    withSonarQubeEnv('local-sonarqube') {
      withCredentials([string(credentialsId: 'Sonar', variable: 'SONAR_TOKEN')]) {
        script {
          def scannerHome = tool name: 'SonarQubeScanner', type: 'SonarQubeScanner'
          sh """
            set -eux
            echo "Scanner path: ${scannerHome}/bin/sonar-scanner"
            ${scannerHome}/bin/sonar-scanner -v

            echo "Running analysis..."
            ${scannerHome}/bin/sonar-scanner \
              -Dsonar.projectKey=stationsync-frontend \
              -Dsonar.projectBaseDir=${WORKSPACE} \
              -Dsonar.sources=src \
              -Dsonar.login=$SONAR_TOKEN \
              -X

            echo "List .scannerwork after run:"
            ls -la .scannerwork || true
            cat .scannerwork/report-task.txt || true
          """
        }
      }
    }
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
