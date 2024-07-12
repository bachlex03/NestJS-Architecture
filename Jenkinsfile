pipeline {
    agent any
    stages {
        stage ("Cloning the repository") {
            steps {
                echo "Cloning the repository"
                git branch: 'main', url: "https://github.com/bachlex03/NestJS-Architecture.git"
            }
        }
        stage ("Packaging and pushing the Image") {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-jenkins-credential', url: 'https://index.docker.io/v1/') {
                    echo "Packaging and pushing the Image"
                    sh "docker build -t baledev/nestjs-architecture ."
                    sh "docker push baledev/nestjs-architecture"
                }
            }
        }
        stage ("Deploy to DEV environment") {
            steps {
                echo "Deploying to DEV environment"
                sh "docker network create dev || echo 'Network already exists'"
                sh "docker container stop nestjs-architecture || echo 'No container running'"
                sh "echo y | docker container prune"
                
                sh "docker image pull baledev/nestjs-architecture"
                sh "docker container run -d --name nestjs-architecture -p 8081:8080 baledev/nestjs-architecture"
            }
        }
    }
    post {
        // Clean after build
        always {
            cleanWs()
        }
    }
}

//