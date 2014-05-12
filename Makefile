lint:
	./node_modules/.bin/jshint ./error.js

test:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--require should \
		--reporter spec

test-cov:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--require should \
		--reporter travis-cov

test-codeclimate:
	@NODE_ENV=test ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter mocha-lcov-reporter \
	| CODECLIMATE_REPO_TOKEN=d160a645caa778c7cb6119dcd63d51e073b0f9c60352f38bc507a229608f72fb ./node_modules/.bin/codeclimate

test-coveralls:
	@NODE_ENV=test YOURPACKAGE_COVERAGE=1 ./node_modules/.bin/mocha -u tdd \
		--require blanket \
		--reporter mocha-lcov-reporter \
	| ./node_modules/coveralls/bin/coveralls.js

test-all: test test-cov test-coveralls

.PHONY: test
