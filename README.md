# RoomKeeping
<h3>Landing Page:</h3>
https://roomkeeping.azurewebsites.net/about

<h3>Login/Dashboard:</h3>
https://roomkeeping.azurewebsites.net/auth/login

# Statechart Diagram
![](./images/Activity.png?raw=true)
Fig. 1: Statechart diagram for the system 

This statechart Diagram shows the flow of how this application works and what a person can do with it. First of all, there is a login page, where login credentials are entered. On the backend the system will check if the account belongs to a student, roomkeeper or an admin, and direct the application to the matched dashboard of the logged account. There is another option too where if the person forgets password he/she can gain it back by following the procedures described in the “forgot password”. 
After the dashboard appears, there are multiple functions a person can perform. A student can send a cleaning appointment, see his profile details, send feedback and make a complaint along with many other things. Unlike a student, roomkeepers don’t have many functions that they can perform. They can view details of their next appointment and view their account details which also contains any feedback about themselves or any complaint that a student might have made. The administrator has the highest range of functionalities. They manage all the roomkeepers' accounts. Can view any profile, roomkeepers’ or student’s. They can register a new student and a new roomkeeper into the system. Admin is responsible for delegating roomkeeper for any cleaning request made. Admin also has the whole control of the system where he can manage all accounts suggestions, complaints and many more things.
# Object Diagram
![](./images/database%20schema.png?raw=true)<br>
Fig. 2: Object diagram for database schemas

The database schema used in this project is shown above. Some of the schemas have some attributes which might be visible in multiple schemas like ‘Feedback ID’,    ‘Student ID’, etc are the attributes which will be used to identify the separate functions a person may have performed and to whom it is concerned about. These schemas are written in MongoDB. All the details regarding the student, roomkeeper or admin are stored as their attributes and are given an ID. This ID is used to define all the requests made by a student, or any complaint registered for the concerned roomkeeper. Everything will be identified with their respective IDs.

# ER Diagram
![](./images/flowchart.png?raw=true)
Fig. 3: ER diagram for clean request cycle

Above given is the ER diagram for the application which shows the flow of the clean request made by the student. All the attributes of student, admin, roomkeeper, the clean request made  and the feedback given by the student are also displayed. 
The flow shows the cycle of the clean request made. The student makes a request, after which the admin assigns a roomkeeper for the request. After the roomkeeper is assigned, it is upto them to accept the request or reject them. If rejected the cycle will curve back to admin for assigning the roomkeeper for the request again. If accepted the cycle goes on.  When the appointment is complete the feedback of the appointment is given by the student. Feedback consists of time in(time when cleaning started) and time out(time when cleaning completed). The feedback also has other optional fields like rating given to the roomkeeper, any suggestion or complaints for the roomkeeper.


# Database Design and Implementation

# Database Design
For creating the database, we have used MongoDB because the data is stored in JSON style documents which is highly compatible to use with javascript frameworks like node.js and react.js. MongoDB is also highly scalable.
Our database consists of several schemas as listed below along with their quantization:

![](./images/all%20database.jpeg?raw=true)
Fig. 4: List of schemas

# Admin:
![](./images/admin.jpeg?raw=true)
Fig.5: Admin database schema

Admin is the user with the most functionality. The database schema consists of several attributes. As depicted above, two admin users are registered as for now. Their ID is their defining factor. Their name, hostel assigned, email and phone number are kept for personal information. Also the password of the users, as you can see above, is 24 hashed characters which is impossible to crack through.


# Students:
![](./images/students.jpeg?raw=true)
Fig. 6: Student database schema

Students are the pillars of this project for whom the whole application is designed and designated. Their database consists of attributes which contain their personal information along with information such as hostel, floor number and room number so that when a request is made, the roomkeeper gets these details to complete their task.
# Roomkeeper:
![](./images/roomkeeper.jpeg?raw=true)
Fig. 7: Roomkeeper database schema

Roomkeepers do not have much functionality in the application. Their database contains attributes which show their profile. It also contains details about how good a roomkeeper is. 


# Tokens:
![](./images/tokens.jpeg?raw=true)
Fig. 8: Temporary tokens database schema

This is a temporary database. During the ‘forgot password’ process, this creates a token which gets mailed to the user. After accessing it and completion of the process, this database is deleted.

# Clean Request:

![](./images/clean%20request%20database%20schema.jpeg?raw=true)
Fig. 9: Clean request database schema

Above displayed is the database schema for the clean request that a student will make.
It contains attributes that will show the timing of the cleaning request, student who made the request along with the ID, floor, room number of the student, hostel, date of the request, roomkeeper assigned and acceptance status, if the roomkeeper is allotted and if the roomkeeper has accepted or denied the request.

# Feedback

![](./images/feedback%20database%20schema.jpeg?raw=true)
Fig. 10: Feedback database schema

After the clean request is complete, the application will want the student to fill in a feedback form which contains attributes like its ID, student ID and roomkeeper’s ID to identify by whom the feedback was given and to whom it was given to. It also contains any star rating that the student might want to give to the roomkeeper for the service to improve his ratings. Also it has a message box for any comments the student might want to make.

# Suggestion


![](./images/suggestion database schema.jpeg?raw=true)
Fig. 11: Suggestion database schema

Suggestions are a part of the feedback given by the student. The suggestion can be identified by the feedback ID it belongs to and has attributes of student ID and roomkeeper ID for them to access it. The main attribute of suggestions is the ‘details’. This is the message box that is filled by the student if he/she has any suggestion to give to the roomkeeper after the service.

# Complaints
![](./images/complaint%20database%20schema.jpeg?raw=true)
Fig. 12: Complaints database schema

Complaints are another part of feedback that a student can give. Like suggestions, complaints are also identified by the feedback ID that it belongs to. Student ID and roomkeeper ID are attributes belonging to the schema. The actual complaint made by the student is stored in the ‘details’ attribute of the schema.

# Implementation
For the user to login to the application, he/she has to know their role in this application, i.e. student, roomkeeper, or the administrator. After selecting their role, the user should type in their login information, their email and password. After confirming their details, the system checks the login credentials and matches them with the database schema in which the user chose their role to be. If the user is not found, the system will ask either to login again with correct details or to sign in as the user might not exist.
![](./images/login%20dashboard.jpeg?raw=true)
Fig. 13: Login page for every user
For signing in, The user has to type in their full name, email address, hostel name, and their password. After submitting the form, a database schema will be created which grants access to the user with their login credentials. 
![](./images/Sign%20up%20dashboard.jpeg?raw=true)
Fig. 14: Sign up page for admins
In the event that a user forgets their password, our application also has a feature that allows users to change their password.
![](./images/Forgot%20password%20dashboard.jpeg?raw=true)
Fig. 15: Forgot password page

After clicking the forgot password on the login page, the user is directed to the page below. The user should choose their role and type in their email address. An email will be sent to the mail address sending a link for changing the password. This is where the temporary token database comes to play. 
![](./images/forgot%20password%20mail.jpeg?raw=true)
Fig. 16: Forgot password email
This is the page for changing passwords. After the user changes the password and confirms the new password, the password attribute in the database for the selected user will change to the new password which will be stored as a 24 hashed characters which is impossible to crack.
![](./images/reset%20password.jpeg?raw=true)
Fig. 17: Reset password page


# Clean Request

# Student panel:
![](./images/student%20dashboard%20clean%20request.jpeg?raw=true)
Fig. 18: Student panel to create cleaning request

Students, while making a clean request, have to input information about his/her date and time of when they want their room cleaned along with any specific instruction for the roomkeeper.
![](./images/student%20clean%20request%20history.jpeg?raw=true)
Fig. 19: History of cleaning requests made
Above shown is the history of the clean request that the student made. Date, time status and the actual time the cleaning appointment took place is displayed across the cleaning request made by the student. Along with this, the roomkeeper assigned is also shown. If the student wants to delete the request then the feature for the above is granted.

# Admin panel:

![](./images/admin%20clean%20requests%20management.jpeg?raw=true)
Fig. 20: cleaning requests history for hostel admin

In the admin dashboard, they can see the whole history of requests made, the clean request if assigned to the roomkeeper, the name of the roomkeeper which is displayed across the request. If no roomkeeper is assigned, ‘allot’ symbol will help the admin to assign the roomkeeper. Also if the roomkeeper previously assigned rejects the request, admin can re-assign another roomkeeper for the request made. Status of the request is also shown across the request showing if the request made is completed, pending, allotted or rejected.

# Roomkeeper panel:

![](./images/roomkeeper%20clean%20request%20accept%20reject.jpeg?raw=true)
Fig. 21: Cleaning requests history for roomkeeper

The roomkeeper’s history of clean requests allotted to him/her are displayed above. The roomkeeper, after the cleaning appointment is completed, can mark the request completed. Room number along with the floor number is displayed across the appointment. Date, time, status and the actual duration of the cleaning appointment are also displayed across the request. If the roomkeeper wants to reject the request due to some personal reason or the timing of two requests being too near, they can reject the request and the request will be allotted to a different roomkeeper by the admin.

# Feedback:

# Student panel:
After the request is completed, the student can write a feedback form for any suggestion or complaint he/she might want to give to the roomkeeper.
![](./images/Student%20suggestion%20form.jpeg?raw=true)
Fig. 22: Feedback form to be filled by the student

This form contains information to fill about the start and completion of the cleaning appointment along with any ratings for the roomkeeper that the student might want to give. Additionally, if the student has any suggestions or complaints for the roomkeeper, the service is provided.

# Admin panel:

![](./images/rating%20record-roomkeeper.jpeg?raw=true)
Fig. 23: Admin feedback history for clean requests

Above displayed is the record of all the feedback given by the student for a complete request. It displayed the ratings given to the roomkeeper along with roomkeeper ID, room number, date and any message given by the student.
![](./images/suggestion%20record-%20admin.jpeg?raw=true)
Fig. 24: Admin suggestion history for clean requests

Above displayed is all the suggestions history that a student might have given after the clean request was completed. It shows who made the suggestion and for whom the suggestion is for. It also shows the room number of the student, date and the suggestion message.
![](./images/complaint%20record-%20admin.jpeg?raw=true)
Fig. 25:Admin complaint history for clean requests

Above displayed is the record of the complaints the student has made for any roomkeeper. Along with the students name, it also shows their room number, date and the ratings that the student has given.


# Roomkeeper panel:

![](./images/rating%20record-roomkeeper.jpeg?raw=true)
Fig. 26: Roomkeeper feedback history for clean requests

Above displayed is the record of all the feedback that the roomkeeper has received for their requests completed. It shows who made the feedback along with the students room number, date and the rating that the roomkeeper has received for the task.
![](./images/suggestion%20record-%20roomkeeper.jpeg?raw=true)
Fig. 27: Roomkeeper Suggestion history for clean requests

Any suggestion received by the roomkeeper is displayed in the above panel. Students name along with the room number and date of the request completed with the suggestion is displayed.

![](./images/complaint%20record-%20roomkeeper.jpeg?raw=true)
Fig. 28: Roomkeeper complaint history for clean requests

Complaints made by the student against the roomkeeper are displayed above with the room number and the date of feedback made. 
