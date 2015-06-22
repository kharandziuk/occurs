.PHONY: login signup
signup:
	curl -X POST -H "Content-Type: application/json" localhost:8000/users -d '{"username": "max", "password": "password"}'
login:
	curl -X GET -H "Content-Type: application/json" localhost:8000/users -d '{"username": "max", "password": "password"}'
create-event:
	curl -X POST -H "Content-Type: application/json" -H "authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NTg4Mjk0OWI5MDFhZTAwMWQzZGNiZmEifQ.nsEowqN6J6eyhoyAN_IBC-MqVTHtX09SKLekeR3_-Yk" localhost:8000/events -d '{}'
get-events:
	curl -X GET -H "Content-Type: application/json" localhost:8000/events -d '{}'

