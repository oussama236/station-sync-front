pipeline {
  agent any
  options { timestamps() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
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
  }

  post {
    success {
      echo "✅ Build Angular réussi : dist archivé avec succès."
    }
    failure {
      echo "❌ Erreur pendant le build Angular. Vérifie les logs Jenkins."
    }
    always {
      echo "📦 Pipeline terminé : ${currentBuild.currentResult}"
    }
  }
}
