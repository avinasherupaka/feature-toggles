npm run build
docker build -t aerup-feature-toggle-ui:1.0.0 .
docker tag aerup-feature-toggle-ui:1.0.0 ****AWS*AC*#****.dkr.ecr.us-east-1.amazonaws.com/aerup-feature-toggle-ui:1.0.0
aws ecr get-login --no-include-email | sh
docker push ****AWS*AC*#****.dkr.ecr.us-east-1.amazonaws.com/aerup-feature-toggle-ui:1.0.0