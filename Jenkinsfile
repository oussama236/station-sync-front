pipeline {
  agent any
  options { timestamps(); ansiColor('xterm') }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Build (prod)') {
      steps {
        // Uses Docker Node image so you don't have to install Node on Jenkins
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
}
