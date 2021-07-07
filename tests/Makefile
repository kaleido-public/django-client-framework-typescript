default:
	docker-compose build
	docker-compose up -d server
	docker-compose run --rm test npx mocha dist/$(FILE)

clean:
	docker-compose down -v
