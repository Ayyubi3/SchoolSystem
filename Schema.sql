CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  html_markdown_code TEXT,
  creator_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL
);


CREATE TABLE user_course (
  user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES course(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, course_id)
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");




CREATE OR REPLACE FUNCTION read()
RETURNS VOID AS $$
BEGIN
    PERFORM * FROM "user";
    PERFORM * FROM "course";
    PERFORM * FROM "user_course";
    PERFORM * FROM "session";
END;
$$ LANGUAGE plpgsql;
