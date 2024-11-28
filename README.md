<!-- docker run --rm -it -v $(pwd):/user/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5000:5000 -e NODE_ENV=development auth-service:dev -->

<!-- Build the image -->

<!-- docker build -t node-template:dev -f docker/dev/Dockerfile . -->

<!-- docker volume create pizzahunt-catalog-service-data -->
<!-- docker run  --name pizzahunt-catalog-service-db  -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -v pizzahunt-catalog-service-data:/data/db -p
 27017:27017 -d mongo -->

<!-- send products of only his tenant if user is manager, on frontend it is already implemented by sending the tenantId -->
 <!-- make categoryName unique -->
 <!-- increase product description length -->
<!-- add isVeg field in category -->
