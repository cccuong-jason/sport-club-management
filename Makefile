COMPOSE ?= docker compose
NPM ?= npm
APP_SERVICE ?= app

.DEFAULT_GOAL := help

.PHONY: help install dev build start lint test verify docker-build docker-up docker-down docker-logs docker-ps docker-restart docker-shell

help:
	@echo Available targets:
	@echo   install        Install Node dependencies
	@echo   dev            Start the local Next.js dev server
	@echo   build          Build the Next.js app
	@echo   start          Start the built Next.js app
	@echo   lint           Run lint checks
	@echo   test           Run Jest tests
	@echo   verify         Run lint, test, and build
	@echo   docker-build   Build the application container image
	@echo   docker-up      Start the full container stack in the background
	@echo   docker-down    Stop the full container stack
	@echo   docker-logs    Tail app container logs
	@echo   docker-ps      Show running compose services
	@echo   docker-restart Recreate the full container stack
	@echo   docker-shell   Open a shell in the app container

install:
	$(NPM) ci

dev:
	$(NPM) run dev

build:
	$(NPM) run build

start:
	$(NPM) run start

lint:
	$(NPM) run lint

test:
	$(NPM) test

verify:
	$(NPM) run lint
	$(NPM) test
	$(NPM) run build

docker-build:
	$(COMPOSE) build

docker-up:
	$(COMPOSE) up --build -d

docker-down:
	$(COMPOSE) down --remove-orphans

docker-logs:
	$(COMPOSE) logs -f $(APP_SERVICE)

docker-ps:
	$(COMPOSE) ps

docker-restart:
	$(COMPOSE) down --remove-orphans
	$(COMPOSE) up --build -d

docker-shell:
	$(COMPOSE) exec $(APP_SERVICE) sh
