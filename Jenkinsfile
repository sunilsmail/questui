timestamps {
	def podLabel = "appointment-ui-${env.BRANCH_NAME}-${UUID.randomUUID().toString()}";
	podTemplate(label: podLabel,
     	containers: [
     			containerTemplate(name: 'docker', image: 'dgxmyquestacreusdev.azurecr.io/docker:20.10.6', ttyEnabled: true, command: 'cat'),
        	// separate containers are provisioned to allow parallel tests to run in separate process spaces
        	containerTemplate(name: 'node1', image: 'dgxmyquestacreusdev.azurecr.io/nodewithchrome:39.091e9d4', ttyEnabled: true, command: 'cat',
                resourceRequestCpu: '500m', resourceRequestMemory: '2048Mi', resourceLimitMemory: '4096Mi'),
        	containerTemplate(name: 'node2', image: 'dgxmyquestacreusdev.azurecr.io/nodewithchrome:39.091e9d4', ttyEnabled: true, command: 'cat',
                resourceRequestCpu: '500m', resourceRequestMemory: '2048Mi', resourceLimitMemory: '4096Mi'),
		],
        volumes: [
            hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')
        ],
        imagePullSecrets: ['dgxmyquestacreusdev.azurecr.io'],
        idleMinutes: 30
    ) {
		node(podLabel) {
			stage('Checkout') {
				def scmVars = checkout scm
				env.commitHash = scmVars.GIT_COMMIT
				env.tagName="${env.BRANCH_NAME}.${env.BUILD_NUMBER}.${env.commitHash.take(7)}"
				currentBuild.displayName = "${env.tagName}"

				if (env.BRANCH_NAME =~ /release/) {
					env.targetEnv = 'rc'
				} else if (env.BRANCH_NAME =~ /hotfix|master|alpha|beta/) {
					env.targetEnv = 'qa'
				} else {
					env.targetEnv = 'dev'
				}

				def chartProp = readYaml file: 'charts/Chart.yaml'
				env.serviceName=chartProp.name;
				env.version=chartProp.version;
				env.repoName=chartProp.git.project;
			}

            container('node1') {
                stage('NPM Install') {
                    //sh 'npm install @qdx-billingweb/websdk@0.0.5 --registry=http://cdrepo01.ops.medplus.com:8080/artifactory/api/npm/qdx-npm/'
                    // when feature_flag_f411_easypay_enhancements is enabled comment above line and uncomment below line and same thing needs to done in package.json file "@qdx-billingweb/websdk": "^2.0.1",
					sh 'npm install @qdx-billingweb/websdk@2.0.1 --registry=http://cdrepo01.ops.medplus.com:8080/artifactory/api/npm/qdx-npm/'
					// sh 'npm install @babel/traverse@^7.18.8 --registry=https://registry.npmjs.org/'
                    sh 'npm install'
                    // sh 'npm install -g sonarqube-scanner'
                }

                stage('Lint') {
                    sh 'npm run lint'
                }
                stage('i18n') {
                    sh 'npm run extract-i18n-template'
                }
            }

          	if ( env.BRANCH_NAME =~ /(develop|feature)/) {

            stage('Tests') {
                try {
                    parallel(
                        'Appointment': {
                            container('node1') {
                                withEnv(['PACT_SERVER_PORT=9000', 'IS_CI=true', 'COVERAGE_FOLDER=appointment_coverage']) {
                                    sh 'npm run test:appointment'
                                }
                            }
                        },
                        'Shared': {
                            container('node2') {
                                withEnv(['PACT_SERVER_PORT=9100', 'IS_CI=true', 'COVERAGE_FOLDER=shared_coverage']) {
                                sh 'npm run test:shared'
                                }
                            }
                        }
                    )
                } finally {
            //        junit 'junit/*/*.xml'
            //    cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/**/cobertura-coverage.xml', conditionalCoverageTargets: '0, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false
                }

                // container('node1') {
                //     withEnv(['PACT_BROKER_HOST=pact-broker-dev.mq.questdiagnostics.com',
                //           "CONSUMER_VERSION=${version}",
                //           "TAG=${env.BRANCH_NAME}"]) {
                //         // sh 'node publish-pact-specs.js'
                //     }
                // }
            }
			}

            container('node1') {
                // stage('Sonarqube') {
                //     sh 'sonar-scanner'
                // }
            }


            stage('Build Assets') {
                container('node1') {
                    sh 'npm run build:appointment'
                    sh 'cp -r ./dist/appointment ./docker/'
                    sh 'ls -a ./docker/'
                }
            }

			if ( env.BRANCH_NAME ==~ /\b(develop|hotfix|release|alpha|beta|master)\b/ || env.BRANCH_NAME =~ '^ltf-') {

				stage('Build Docker Image') {

				  	container('docker') {
	    				docker.withRegistry('https://dgxmyquestacreusdev.azurecr.io', 'dgxmyquestacreusdev.azurecr.io') {
	      					def serviceImage = docker.build("${env.repoName}:${env.tagName}",
	                   			"-f ./docker/Dockerfile " +
	      		            	" --build-arg=PROJECT_NAME=${env.repoName}" +
	      		            	" ./docker")
	      					serviceImage.push()
						}
					}
				}

				stage("Deploy Helm Chart - ${env.targetEnv}") {

					def deployerBranch = 'develop'
					if ( env.BRANCH_NAME =~ /release|alpha|beta/ ) {
						deployerBranch = "release"
					} else if (  env.BRANCH_NAME =~ /hotfix*/  ||  env.BRANCH_NAME =~ /ltf-*/ ){
						deployerBranch = "hotfix"
					} else if (  env.BRANCH_NAME =~ /master/ ){
						deployerBranch = "master"
					}

					def deployer = build job: "../deployer/$deployerBranch",
						wait: true,
						parameters: [
							string(name: 'env', value: "${env.targetEnv}"),
							string(name: 'gitproject', value: "${env.repoName}"),
							string(name: 'tag', value: "${env.tagName}"),
							string(name: 'gitcommit', value: "${env.commitHash}")
						]
					if (deployer.result == 'FAILURE') {
						error("Deploy ${env.serviceName}:${env.tagName} to myquest-${env.targetEnv} FAILED")
					}
				}
			}
   			milestone() // when done, cancel all older jobs waiting on the lock
        }
    }
}
