pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''npm install
'''
        sh 'npm run build'
        echo 'Building the project...'
      }
    }

    stage('Build completed') {
      steps {
        echo 'Build complete'
      }
    }

  }
}