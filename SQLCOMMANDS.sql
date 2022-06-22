create table user(
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fullName varchar(100) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    pass varchar(255) NOT NULL,
    verified Boolean NOT NULL DEFAULT false,
    phoneNumber INT(50),
    userAddress varchar(255),
    userImg varchar(255)
)

create table courses(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userId int(11) UNSIGNED NOT NULL,
    courseName varchar(255) NOT NULL,
    imageUrl varchar(255) NOT NULL,
    courseDescription varchar(255) NOT NULL,
    createTime DATETIME NOT NULL,
    isMathjax boolean NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) 
)

create table poolCategory(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    userId int(11) UNSIGNED NOT NULL,
    categoryName varchar(255) NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id) 
)

ALTER TABLE courses
drop isMathjax;

create table poolQuestions(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    courseName varchar(255) NOT NULL,
    question varchar (255) NOT NULL,
    questionImage varchar(255),
    correctOption varchar (255) NOT NULL,
    questionType varchar(255) NOT NULL,
    poolCategoryId int(11) UNSIGNED NOT NULL,
    userId int(11) UNSIGNED NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (poolCategoryId) REFERENCES poolCategory(id) 
)

create table questionOptions(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    questionId int(11) UNSIGNED NOT NULL,
    options varchar(255) NOT NULL,
    FOREIGN KEY (questionId) REFERENCES poolQuestions(id)
)


-- select * from poolQuestions where userId=?

-- SELECT 
--     *,questionOptions.questionId,questionOptions.options
-- FROM 
--     poolQuestions
-- CROSS JOIN 
--     questionOptions 
-- ON
--     poolQuestions.id=questionOptions.questionId

create table enrolled(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    userId int(11) UNSIGNED NOT NULL,
    joinedTime DATETIME NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)

create table courseContent(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    fileUrl varchar(255) NOT NULL,
    fileName varchar(255) NOT NULL,
    fileType varchar(255) NOT NULL,
    createdTime DATETIME NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
)


create table assignment(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignmentTitle varchar(255) NOT NULL,
    courseId int(11) UNSIGNED NOT NULL,
    fileUrl varchar(255) NOT NULL,
    fileName varchar(255) NOT NULL,
    createdTime DATETIME NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    -- userId int(11) UNSIGNED NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)

create table uploadAssignment(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    userId int(11) UNSIGNED NOT NULL,
    fileUrl varchar(255) NOT NULL,
    uploadTime DATETIME NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)

create table assignmentResult(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    courseId int(11) UNSIGNED NOT NULL,
    userId int(11) UNSIGNED NOT NULL,
    uaId int(11) UNSIGNED NOT NULL,
    marks int(10) NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)

create table quiz(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quizTitle varchar(255) NOT NULL,
    courseId int(11) UNSIGNED NOT NULL,
    createdTime DATETIME NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    -- userId int(11) UNSIGNED NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)

create table quizQuestions(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quizId int(11) UNSIGNED,
    questionId int(11) UNSIGNED,
    FOREIGN KEY (quizId) REFERENCES quiz(id),
    FOREIGN KEY (questionId) REFERENCES poolQuestions(id),
)

create table attemptedQuiz(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quizId int(11) UNSIGNED,
    questionId int(11) UNSIGNED,
    userId int(11) UNSIGNED NOT NULL,
    userAnswer varchar(255) NOT NULL,
    FOREIGN KEY (quizId) REFERENCES quiz(id),
    FOREIGN KEY (questionId) REFERENCES poolQuestions(id),
    FOREIGN KEY (userId) REFERENCES user(id),
);

create table quizResult(
    id int(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quizId int(11) UNSIGNED,
    userId int(11) UNSIGNED NOT NULL,
    questionId int(11) UNSIGNED,
    marks int(10) NOT NULL,
    FOREIGN KEY (quizId) REFERENCES quiz(id),
    FOREIGN KEY (questionId) REFERENCES poolQuestions(id),
    FOREIGN KEY (userId) REFERENCES user(id),
)




curl 'http://localhost:5000/api/courses' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: _xsrf=2|0e2c9b63|4389f36ede50106eb6af6cc56ae2ea23|1654011533; username-localhost-8889="2|1:0|10:1654014864|23:username-localhost-8889|44:ZTdmOTkwY2I0NjIwNDNkMjg2MGJhOTA5Y2FiMmMyMzA=|12d969164097e21337cf3ef456221b48fef8cd84fa149b0e27bfce39b6479316"; username-localhost-8888="2|1:0|10:1655310128|23:username-localhost-8888|44:ZjA4M2VjNGQzYTg2NGQyNDg4Mzk2MmM5MTdjOTA3Njk=|1d37052c8df5809edbc9b957d9aeeeda831e2c4575ba30e8068192c9db1a6f93"; reFreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1emFpZmEgYWJpZCIsInVzZXJJZCI6MSwiaWF0IjoxNjU1ODcxMTgwLCJleHAiOjE2NTYwNDM5ODB9.ro6MWUtTWPFtC8KwnLEXq_244ZyM3L-VBkbebEDPfJE; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imh1emFpZmEgYWJpZCIsInVzZXJJZCI6MSwiaWF0IjoxNjU1ODcxMTk0LCJleHAiOjE2NTU4NzEyMDR9.lkZ2be06nQU0PoQsDUI4yVO8jw1iLtpYBbyz41G9HrU' \
  -H 'Origin: http://localhost:3000' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://localhost:3000/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw '{"userId":1,"imageUrl":"https://firebasestorage.googleapis.com/v0/b/fyp-bb1b4.appspot.com/o/courseImages%2Fmse.jpg?alt=media&token=636d64b5-31ac-46e0-8d31-702f72ecb5cc","courseName":"asdasdsda","description":"asdasdsadsadsad","createTime":"2022-06-22 09:14:43"}' \
  --compressed