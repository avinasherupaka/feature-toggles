#!/usr/bin/env bash
################################################################################
# Fargate Deploy Script                                                        #
################################################################################
# 2019-07 by Avinash Erupaka <avinasherupaka>
#
# This script let's you build and deploy an app to fargate making it flexible for your CI/CD checks.
# Some pre-reqs:
# add-app-parameter.js, get-app-parameter.js, get-value-by-key.js can be found in this project under /scripts/utils
# fargate_deploy_params.txt lets you supply build and runtime parameters dynamically without passing them as positional arguments.

# Usage:
#    cat ./fargate_deploy_params.txt | awk -v FS="<key>=" 'NF>1{print $2}' | xargs ./fargate_build_deploy.sh
#

set -e

echo "########## START - Setting parameters passed in ##########"
echo "List of all args passed" $@
function usage()
{
    echo "Allowed Arguments for build_and_deploy.sh."
    echo ""
    echo "./build_and_deploy.sh"
    echo "\t-h --help"
    echo "\t--accountId=$accountId"
    echo "\t--fargateStackName=$fargateStackName"
    echo "\t--tagsFile=$tagsFile"
    echo "\t--region=$region"
    echo "\t--stopForSmoketesting=$stopForSmoketesting"
    echo "\t--fargateNotificationArn=$fargateNotificationArn"
    echo "\t--buildDockerImage=$buildDockerImage"
    echo "\t--deployToFargate=$deployToFargate"
    echo ""
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | sed 's/^[^=]*=//g'`
    case $PARAM in
        -h | --help)
            usage
            exit
            ;;
        --accountId)
            accountId=${VALUE:-****AWS*AC*#****}
            ;;
        --fargateStackName)
            fargateStackName=${VALUE:-SC-****AWS*AC*#****-pp-qipgqjbmsiw2y}
            ;;
        --tagsFile)
            tagsFile=${VALUE:-./tags-np.json}
            ;;
        --region)
            region=${VALUE:-us-east-1}
            ;;
        --fargateNotificationArn)
            fargateNotificationArn=${VALUE:-arn:aws:sns:us-east-1:****AWS*AC*#****:aerup-cf-notifier-aerupCFNotifierTopic-GI9LPJHZG8WN}
            ;;
        --buildDockerImage)
            buildDockerImage=${VALUE:-false}
            ;;
        --deployToFargate)
            deployToFargate=${VALUE:-false}
            ;;
        --stopForSmoketesting)
            stopForSmoketesting=${VALUE:-false}
            ;;
        --approvalMD5String)
            stopForSmoketesting=${VALUE:-''}
            ;;
        *)
            echo "ERROR: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

echo "accountId ${accountId}"
echo "fargateStackName ${fargateStackName}"
echo "region ${region}"
echo "fargateNotificationArn ${fargateNotificationArn}"
echo "buildDockerImage ${buildDockerImage}"
echo "deployToFargate ${deployToFargate}"
echo "stopForSmoketesting ${stopForSmoketesting}"
echo "########## END - Setting parameters passed in ##########"

echo "########## START - Removing stale aws credentials ##########"
rm -rf /var/jenkins_home/.aws/credentials
echo "########## END - Removing stale aws credentials ##########"

echo "########## START - Downloading utilities for deploy ##########"
aws s3 cp s3://fargate-deploy/fargate-application.yml ./fargate-application.yml
echo "########## END - Downloading utilities for deploy ##########"

echo "########## START - Variables extraction from existing resources for downstream ##########"
environment="$(awk -v RS= '{$1=$1}1' environment.json)"
appVersion="$(cat ./package.json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]')"
appName=$(cat ./app_parameters.json | node ./scripts/utils/get-app-parameter.js AppName)
randomString=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13)

echo "environment ${environment}"
echo "appVersion ${appVersion}"
echo "appName ${appName}"
echo "randomString ${randomString}"
echo "########## END - Variables extraction from existing resources for downstream ##########"

echo "########## START - Setting up AWS Credentials ##########"
stsAssumeCreds=$(aws sts assume-role --role-arn "arn:aws:iam::${accountId}:role/standard-user" --role-session-name "fargate-deployment")
export AWS_SECRET_ACCESS_KEY=$(echo ${stsAssumeCreds} | node ./scripts/utils/get-value-by-key.js Credentials | node ./scripts/utils/get-value-by-key.js SecretAccessKey | sed 's/\"//g')
export AWS_SESSION_TOKEN=$(echo ${stsAssumeCreds} | node ./scripts/utils/get-value-by-key.js Credentials | node ./scripts/utils/get-value-by-key.js SessionToken | sed 's/\"//g')
export AWS_ACCESS_KEY_ID=$(echo ${stsAssumeCreds} | node ./scripts/utils/get-value-by-key.js Credentials | node ./scripts/utils/get-value-by-key.js AccessKeyId | sed 's/\"//g')
echo "########## END - Setting up AWS Credentials ########## "

if [ ! -z "$fargateNotificationArn" ]
then
    notificationArns="--notification-arns ${fargateNotificationArn}"
else
    notificationArns=""
fi

echo "########## Creating docker repository...  If it already exists move on. ##########"
set +e
aws ecr create-repository --repository-name ${appName} --region ${region}
set -e

$(aws ecr get-login --no-include-email --region ${region})

echo 'Building image url with md5 hash in case of prod deployment after approval...'
imageUrl=${accountId}.dkr.ecr.${region}.amazonaws.com/${appName}:${appVersion}
#if [[ ! -z $approvalMD5String ]]; then
#    imageUrl=${accountId}.dkr.ecr.${region}.amazonaws.com/${appName}:${appVersion}:${approvalMD5String}
#fi

# echo "########## START - Building Docker container from application ##########"
# if [[ $buildDockerImage ]]; then
#     docker build -t ${appName}:${appVersion} .
#     docker tag ${appName}:${appVersion} ${imageUrl}
#     echo "Uploading application to Docker repository of account ${accountId}"
#     docker push ${imageUrl}
# fi
# echo "########## END - Building Docker container from application ##########"

echo "########## START - Building app_parameters for fargate application ##########"
cat ./app_parameters.json | node ./scripts/utils/add-app-parameter.js ImageUrl "${imageUrl}" > ./temp_app_parameters.json
cat ./temp_app_parameters.json | node ./scripts/utils/add-app-parameter.js FargateStackName ${fargateStackName} > ./temp2_app_parameters.json
cat ./temp2_app_parameters.json | node ./scripts/utils/add-app-parameter.js EnvironmentVariables "${environment}" > ./temp3_app_parameters.json
cat ./temp3_app_parameters.json | node ./scripts/utils/add-app-parameter.js StopForSmoketesting ${stopForSmoketesting} > ./temp4_app_parameters.json
echo "########## END - Building app_parameters for fargate application ##########"

echo "########## START - Deploying application to Fargate...##########"
if [[ $deployToFargate ]]; then
aws cloudformation create-stack --stack-name ${appName}-${randomString} --capabilities CAPABILITY_IAM --region ${region} \
--template-body file://./fargate-application.yml \
--parameters file://./temp4_app_parameters.json \
--tags file://${tagsFile} \
${notificationArns}
fi
echo "########## END - Deploying application to Fargate...##########"

echo "########## START - Cleaning up... ##########"
rm -f ./temp_app_parameters.json
rm -f ./temp2_app_parameters.json
rm -f ./temp3_app_parameters.json
rm -f ./temp4_app_parameters.json
rm -f ./fargate-application.yml
echo "########## END - Cleaning up... ##########"

echo "########## Application deployment complete. ##########"
