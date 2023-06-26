# Social network for organization management, final project
by Or Amram and Roni Khizverg

The system is a platform that offers a private social network for organizations that will help the management of the organization to spread internal information of the organization such as special events, successes, etc.  In addition, to take care of social life and close communication between the organization's employees themselves and the management.

The developed system includes an internal social network accessible only to organization employees. Within the system, users can publish posts, ask questions, engage in discussions and voting, create events, have private chats, update attendance, and even generate attendance reports. Managers can assign tasks to their employees, track the progress status of tasks (In Progress, To Do, Done), monitor employee attendance, add employees, and generate PDF reports based on that data.

In addition, we implemented the construction of the company's hierarchical tree and classified employees into different departments. We also implemented the Friend of Friend (FOF) algorithm to establish connections between employees based on friendships between friends.

In the final stage, we implemented an algorithm based on the Q-learning principle to find the best solution for questions asked within the system. Users are rewarded with points for proposing the best solution (gamification).

The server-side was written in JavaScript using the js.Node runtime environment.
The client-side was written in JavaScript using the React.js library, which was implemented to design the website according to the principles of "Gestalt". The goal was to provide a simple interface that any user could use easily.
The chosen database is MongoDB, a non-relational database.
The development environment we used to develop the project is VsCode.
