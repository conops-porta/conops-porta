# ConOps 2.0
ConOps is the behind the scenes application of 2D Con. It allows the staff and volunteers at 2D Con to manage their schedules, and it allows attendees to volunteer as a walk-up with limited authorization. 


## Built With

- React 
- Redux 
- Express
- Passport 
- PostgreSQL 
- Material-UI 
- NOTE: a full list of dependencies can be found in `package.json`


We **STRONGLY** recommend following these instructions carefully. It's a lot, and will take some time to set up, but your life will be much easier this way in the long run.


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Prerequisites

- [Node.js](https://nodejs.org/en/)


### Installing 

1. Download this project.
2. `npm install`
3. While it is installing, copy and paste the database SQL file into Postgres, and execute all of the statements. 

You may have to `npm install` some specific Material-UI components to get the application to work if npm install dosent get them all. 

### Completed Features

- [x] Registered attendees can sign up as a new volunteer for shifts
- [x] Admin can upload new volunteer schedule
- [x] Admin can edit volunteer schedule
- [x] Admin can specify shifts allowed for new volunteers
- [x] Approved volunteers can add and remove volunteers from the schedule
- [x] Approved volunteers can view hours signed up for and hours completed
- [x] Approved volunteers can search schedule by volunteer name


### Next Steps

- [ ] Allow Admin to add or remove a department after schedule upload
- [ ] Allow Admin to add or remove a role after schedule upload
- [ ] Pipeline from 2D Con Volunteers database to bring in volunteers' data as they sign up
- [ ] Create and add games to a game library
- [ ] Pre-register for upcoming convention


## Deployment 

Code pushed to the **deployment** branch will be automatically built and deployed through Heroku. 
The deployed version of the app can be found [here](https://conops-porta.herokuapp.com/).


## ConOps Version 2 was created in November 2019 by: 

- David Diaz
- Edith Emmings
- Jessica Woudsma
- Lilith Bentley
- Nate Wold


## ConOps Version 1 was created in October 2019 by:

- Alex Smith
- Chris O'Bannon
- Declan Bernardin
- Dustin Fedie
- Marit Zelinsky