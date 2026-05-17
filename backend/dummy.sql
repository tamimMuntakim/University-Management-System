INSERT INTO roles (id, role_name) VALUES 
  (gen_random_uuid(), 'ROLE_ADMIN'),
  (gen_random_uuid(), 'ROLE_TEACHER'),
  (gen_random_uuid(), 'ROLE_STUDENT');

INSERT INTO departments (id, department_name, dept_code) VALUES 
  (gen_random_uuid(), 'Computer Science and Engineering', 'CSE'),
  (gen_random_uuid(), 'Electrical and Electronics Engineering', 'EEE'),
  (gen_random_uuid(), 'Business Administration', 'BBA');

-- We use a pre-calculated BCrypt hash for "password123" for testing
INSERT INTO users (id, email, password_hash, role_id) VALUES 
  (gen_random_uuid(), 'admin@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_ADMIN')),
  (gen_random_uuid(), 'teacher@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_TEACHER')),
  (gen_random_uuid(), 'student@university.edu', '$2a$10$wIX.qFzPzCmr227.Z5H5/uI04mN2eS.O6oR2wV.p1EogY6Z0P0wEa', (SELECT id FROM roles WHERE role_name = 'ROLE_STUDENT'));
