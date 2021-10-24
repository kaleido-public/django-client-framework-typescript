default: run-server build-test test clean
	@echo Done

run-server:
	docker-compose up -d server

build-test:
	cd .. && npm install && npm run build &&\
	export PACKAGE_FILE=`npm pack` &&\
	echo target is $$PACKAGE_FILE &&\
	cd - && docker-compose build test

test: build-test
	docker-compose run --rm test npm run mocha

clean:
	docker-compose down -v

