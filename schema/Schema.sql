CREATE TABLE "user" (
  id SERIAL PRIMARY KEY, -- Trigger sets id
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE course (
  id SERIAL PRIMARY KEY, -- Trigger sets id
  name VARCHAR(255) NOT NULL,
  html_markdown_code TEXT,
  creator_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE user_course (
  user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  course_id INTEGER REFERENCES course(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (user_id, course_id)
);


CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  course_id INTEGER REFERENCES "course"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");



CREATE OR REPLACE FUNCTION set_idu()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.id := floor(random() * 900000 + 100000)::integer; -- Generates a random 6-digit number
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION set_idc()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.id := floor(random() * 9000 + 1000)::integer; -- Generates a random 6-digit number
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER set_id_trigger
    BEFORE INSERT ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION set_idu();
    

CREATE TRIGGER set_id_trigger
    BEFORE INSERT ON "course"
    FOR EACH ROW
    EXECUTE FUNCTION set_idc();




    

