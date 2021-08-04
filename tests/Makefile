default:
	docker-compose build
	docker-compose up -d server
	docker-compose run --rm test npm run mocha
	make clean

clean:
	docker-compose down -v
