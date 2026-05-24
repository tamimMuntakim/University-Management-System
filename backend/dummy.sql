INSERT INTO roles (id, role_name) VALUES 
  (gen_random_uuid(), 'ROLE_ADMIN'),
  (gen_random_uuid(), 'ROLE_TEACHER'),
  (gen_random_uuid(), 'ROLE_STUDENT');

INSERT INTO departments (id, department_name, dept_code) VALUES 
  (gen_random_uuid(), 'Computer Science and Engineering', 'CSE'),
  (gen_random_uuid(), 'Electrical and Electronics Engineering', 'EEE'),
  (gen_random_uuid(), 'Information and Communication Engineering', 'ICE'),
  (gen_random_uuid(), 'Business Administration', 'BBA');

-- We use a pre-calculated BCrypt hash for "password123" for testing
INSERT INTO users (id, email, password_hash, role_id) VALUES 
  (gen_random_uuid(), 'admin@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_ADMIN')),
  (gen_random_uuid(), 'teacher@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_TEACHER')),
  (gen_random_uuid(), 'student@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT'));

-- === New 10 Users Generation ===

-- 1. Ensure the ROLE_FACULTY exists
INSERT INTO roles (id, role_name) 
VALUES (gen_random_uuid(), 'ROLE_FACULTY') 
ON CONFLICT (role_name) DO NOTHING;

-- 2. Create 5 Students
WITH student_data AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'james.wilson@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'emma.brown@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'liam.garcia@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'olivia.jones@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'noah.miller@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT'))
    RETURNING id, email
)
INSERT INTO student_profiles (id, user_id, student_reg_id, department_id, cgpa, credits_completed)
SELECT 
    gen_random_uuid(), 
    id, 
    'STU-2024-' || LPAD(floor(random()*10000)::text, 4, '0'), 
    (SELECT id FROM departments WHERE dept_code = 'CSE' LIMIT 1),
    0.0,
    0
FROM student_data;

-- 3. Create 5 Faculties
WITH faculty_data AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'dr.robert@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.sarah@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.michael@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.linda@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.william@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY'))
    RETURNING id, email
)
INSERT INTO faculty_profiles (id, user_id, faculty_staff_id, department_id, designation, joining_date)
SELECT 
    gen_random_uuid(), 
    id, 
    'FAC-2024-' || LPAD(floor(random()*1000)::text, 3, '0'), 
    (SELECT id FROM departments WHERE dept_code = 'EEE' LIMIT 1),
    'Assistant Professor',
    CURRENT_DATE
FROM faculty_data;

-- === Additional 20 Users (10 Students, 10 Faculties) ===

-- 4. Create 5 Students for EEE Dept
WITH student_eee AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'sophia.lee@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'logan.hall@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'mia.young@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'lucas.king@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'ava.wright@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT'))
    RETURNING id
)
INSERT INTO student_profiles (id, user_id, student_reg_id, department_id, cgpa, credits_completed)
SELECT gen_random_uuid(), id, 'STU-2024-' || LPAD(floor(random()*10000)::text, 4, '0'), (SELECT id FROM departments WHERE dept_code = 'EEE' LIMIT 1), 0.0, 0 FROM student_eee;

-- 5. Create 5 Students for ICE Dept
WITH student_ice AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'ethan.adams@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'isabella.scott@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'mason.green@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'chloe.baker@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT')),
    (gen_random_uuid(), 'jacob.hill@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT'))
    RETURNING id
)
INSERT INTO student_profiles (id, user_id, student_reg_id, department_id, cgpa, credits_completed)
SELECT gen_random_uuid(), id, 'STU-2024-' || LPAD(floor(random()*10000)::text, 4, '0'), (SELECT id FROM departments WHERE dept_code = 'ICE' LIMIT 1), 0.0, 0 FROM student_ice;

-- 6. Create 5 Faculties for CSE Dept
WITH faculty_cse AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'dr.alice@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.david@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.carol@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.steve@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.fiona@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY'))
    RETURNING id
)
INSERT INTO faculty_profiles (id, user_id, faculty_staff_id, department_id, designation, joining_date)
SELECT gen_random_uuid(), id, 'FAC-2026-' || LPAD(floor(random()*1000)::text, 3, '0'), (SELECT id FROM departments WHERE dept_code = 'CSE' LIMIT 1), 'Associate Professor', CURRENT_DATE FROM faculty_cse;

-- 7. Create 5 Faculties for ICE Dept
WITH faculty_ice AS (
    INSERT INTO users (id, email, password_hash, role_id) VALUES
    (gen_random_uuid(), 'dr.kevin@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.nancy@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.paul@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'prof.rachel@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY')),
    (gen_random_uuid(), 'dr.tom@university.edu', '$2a$10$9PvHkwX0XK8giB/wFUA/EO4e6DiroJtuhUV1TUjF/Q6ey3PtlaR6e', (SELECT id FROM roles WHERE role_name = 'ROLE_FACULTY'))
    RETURNING id
)
INSERT INTO faculty_profiles (id, user_id, faculty_staff_id, department_id, designation, joining_date)
SELECT gen_random_uuid(), id, 'FAC-2026-' || LPAD(floor(random()*1000)::text, 3, '0'), (SELECT id FROM departments WHERE dept_code = 'ICE' LIMIT 1), 'Assistant Professor', CURRENT_DATE FROM faculty_ice;
