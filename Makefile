.PHONY: login signup
signup:
	curl -X POST -H "Content-Type: application/json" localhost:8000/users -d '{"username": "max", "password": "password"}'
login:
	curl -X GET -H "Content-Type: application/json" localhost:8000/users -d '{"username": "max", "password": "password"}'

