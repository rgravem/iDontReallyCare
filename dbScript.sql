CREATE TABLE server (id SERIAL PRIMARY KEY, first_name VARCHAR(32), last_name VARCHAR(32));

CREATE TABLE dinner_table (id SERIAL PRIMARY KEY, table_name VARCHAR(12), capacity INTEGER, status VARCHAR(12), server_id INT REFERENCES server(id) ON DELETE SET NULL);
