CREATE TABLE server (id SERIAL PRIMARY KEY, first_name VARCHAR(32), last_name VARCHAR(32));

CREATE TABLE dinner_table (id SERIAL PRIMARY KEY, capacity INTEGER, status VARCHAR(12), server_id INT REFERENCES server(id));
